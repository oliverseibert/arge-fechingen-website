// Erzeugt mit `npm run supabase:types` (Supabase CLI); bei Schemaänderungen neu generieren
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          category: Database['public']['Enums']['event_category'];
          created_at: string;
          description: string | null;
          ends_at: string | null;
          id: string;
          location: string | null;
          starts_at: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category?: Database['public']['Enums']['event_category'];
          created_at?: string;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          location?: string | null;
          starts_at: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: Database['public']['Enums']['event_category'];
          created_at?: string;
          description?: string | null;
          ends_at?: string | null;
          id?: string;
          location?: string | null;
          starts_at?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      news: {
        Row: {
          author_id: string | null;
          content: string;
          created_at: string;
          id: string;
          image_alt: string | null;
          image_path: string | null;
          published_at: string | null;
          slug: string;
          status: Database['public']['Enums']['news_status'];
          teaser: string | null;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          image_alt?: string | null;
          image_path?: string | null;
          published_at?: string | null;
          slug: string;
          status?: Database['public']['Enums']['news_status'];
          teaser?: string | null;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string | null;
          content?: string;
          created_at?: string;
          id?: string;
          image_alt?: string | null;
          image_path?: string | null;
          published_at?: string | null;
          slug?: string;
          status?: Database['public']['Enums']['news_status'];
          teaser?: string | null;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'news_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      newsletter_subscribers: {
        Row: {
          confirmed_at: string | null;
          consent_at: string | null;
          created_at: string;
          email: string;
          id: string;
          status: Database['public']['Enums']['subscriber_status'];
          token: string;
          unsubscribed_at: string | null;
        };
        Insert: {
          confirmed_at?: string | null;
          consent_at?: string | null;
          created_at?: string;
          email: string;
          id?: string;
          status?: Database['public']['Enums']['subscriber_status'];
          token?: string;
          unsubscribed_at?: string | null;
        };
        Update: {
          confirmed_at?: string | null;
          consent_at?: string | null;
          created_at?: string;
          email?: string;
          id?: string;
          status?: Database['public']['Enums']['subscriber_status'];
          token?: string;
          unsubscribed_at?: string | null;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          active: boolean;
          created_at: string;
          email: string | null;
          id: string;
          name: string | null;
          role: Database['public']['Enums']['app_role'];
        };
        Insert: {
          active?: boolean;
          created_at?: string;
          email?: string | null;
          id: string;
          name?: string | null;
          role?: Database['public']['Enums']['app_role'];
        };
        Update: {
          active?: boolean;
          created_at?: string;
          email?: string | null;
          id?: string;
          name?: string | null;
          role?: Database['public']['Enums']['app_role'];
        };
        Relationships: [];
      };
    };
    Views: Record<never, never>;
    Functions: {
      has_role: {
        Args: { required_role: Database['public']['Enums']['app_role'] };
        Returns: boolean;
      };
    };
    Enums: {
      app_role: 'admin' | 'content_creator';
      event_category: 'jubilaeum_2027' | 'allgemein';
      news_status: 'draft' | 'published';
      subscriber_status: 'pending' | 'confirmed' | 'unsubscribed';
    };
    CompositeTypes: Record<never, never>;
  };
}

type PublicSchema = Database['public'];

export type Tables<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Row'];
export type TablesInsert<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Insert'];
export type TablesUpdate<T extends keyof PublicSchema['Tables']> = PublicSchema['Tables'][T]['Update'];
export type Enums<T extends keyof PublicSchema['Enums']> = PublicSchema['Enums'][T];
