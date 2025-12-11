import { supabase } from './supabase';

export interface Profile {
    id: string;
    username: string;
    email: string;
}

export interface Invitation {
    id: string;
    inviter_id: string;
    invitee_id: string;
    table_id: number;
    game_date: string;
    status: 'pending' | 'accepted' | 'expired' | 'declined';
    token: string;
    created_at: string;
}

export const InvitationService = {
    /**
     * Search for users by username (partial match)
     */
    async searchUsers(query: string): Promise<Profile[]> {
        if (!query || query.length < 2) return [];

        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, email')
            .ilike('username', `%${query}%`)
            .limit(5);

        if (error) {
            console.error('Error searching users:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Create a new invitation
     */
    async createInvitation(inviterId: string, inviteeId: string, tableId: number, gameDate: Date): Promise<{ data: Invitation | null, error: any }> {
        const { data, error } = await supabase
            .from('invitations')
            .insert({
                inviter_id: inviterId,
                invitee_id: inviteeId,
                table_id: tableId,
                game_date: gameDate.toISOString(),
                status: 'pending'
            })
            .select()
            .single();

        return { data, error };
    },

    /**
     * Get invitation by token
     */
    async getInvitationByToken(token: string): Promise<{ data: Invitation | null, error: any }> {
        const { data, error } = await supabase
            .from('invitations')
            .select('*')
            .eq('token', token)
            .single();
            
        return { data, error };
    },

    /**
     * Accept invitation: Update status AND create reservation
     */
    async acceptInvitation(invitationId: string, userId: string, tableId: number, gameDate: string, gameMode: string): Promise<{ success: boolean, error?: any }> {
        
        // 1. Mark invitation as accepted
        const { data: updatedInvite, error: inviteError } = await supabase
            .from('invitations')
            .update({ status: 'accepted' })
            .eq('id', invitationId)
            .eq('invitee_id', userId) // Security check
            .eq('status', 'pending') // Double-run protection
            .select()
            .single();

        if (inviteError || !updatedInvite) {
            return { success: false, error: inviteError || new Error("Einladung bereits verarbeitet oder ungültig.") };
        }

        // 2. Create Reservation
        // Calculate End Time (same day 23:59)
        const dateObj = new Date(gameDate);
        const endTime = new Date(dateObj);
        endTime.setHours(23, 59, 0, 0);

        const { error: resError } = await supabase
            .from('reservations')
            .insert({
                table_id: tableId,
                user_id: userId,
                start_time: gameDate,
                end_time: endTime.toISOString(),
                game_mode: gameMode
            });

        if (resError) {
             // Rollback invitation status (optional, but good practice manually if no transaction)
             // For now we just return error, user might need to retry.
             console.error("Failed to create reservation:", resError);
             return { success: false, error: resError };
        }

        return { success: true };
    },

    /**
     * Simulation of sending an email (since we don't have Edge Functions setup here yet)
     */
    async mockSendEmail(inviteeEmail: string | undefined, token: string) {
        const link = `${window.location.origin}/invite?token=${token}`;
        console.log(`[MOCK EMAIL SERVICE] To: ${inviteeEmail} | Link: ${link}`);
        alert(`[MOCK EMAIL] Einladung gesendet! Der Link wäre: \n${link}\n(Check Console for copyable link)`);
    }
};
