export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      educators: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_plan: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_plan?: string
          email: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_plan?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_plan: string
          email: string
          id: string
          name: string
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_plan?: string
          email: string
          id: string
          name: string
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_plan?: string
          email?: string
          id?: string
          name?: string
          username?: string
        }
        Relationships: []
      }
      plans: {
        Row: {
          billing_period: string | null
          created_at: string
          features: Json
          id: string
          is_active: boolean
          name: string
          price_inr: number
          type: string
        }
        Insert: {
          billing_period?: string | null
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          name: string
          price_inr?: number
          type: string
        }
        Update: {
          billing_period?: string | null
          created_at?: string
          features?: Json
          id?: string
          is_active?: boolean
          name?: string
          price_inr?: number
          type?: string
        }
        Relationships: []
      }
      educator_subscriptions: {
        Row: {
          created_at: string
          educator_id: string
          expires_at: string | null
          id: string
          plan_id: string
          started_at: string
          status: string
        }
        Insert: {
          created_at?: string
          educator_id: string
          expires_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
          status?: string
        }
        Update: {
          created_at?: string
          educator_id?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "educator_subscriptions_educator_id_fkey"
            columns: ["educator_id"]
            isOneToOne: false
            referencedRelation: "educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "educator_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
        ]
      }
      student_subscriptions: {
        Row: {
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          started_at: string
          status: string
          student_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
          status?: string
          student_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
          status?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_subscriptions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          created_at: string
          description: string | null
          educator_id: string
          id: string
          is_published: boolean
          question_count: number
          slug: string
          subject: string | null
          time_limit_mins: number | null
          title: string
          total_marks: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          educator_id: string
          id?: string
          is_published?: boolean
          question_count?: number
          slug: string
          subject?: string | null
          time_limit_mins?: number | null
          title: string
          total_marks?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          educator_id?: string
          id?: string
          is_published?: boolean
          question_count?: number
          slug?: string
          subject?: string | null
          time_limit_mins?: number | null
          title?: string
          total_marks?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tests_educator_id_fkey"
            columns: ["educator_id"]
            isOneToOne: false
            referencedRelation: "educators"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correct: string | null
          created_at: string
          explanation: string | null
          id: string
          marks: number
          option_a: string
          option_b: string
          option_c: string | null
          option_d: string | null
          order_index: number
          question_text: string
          test_id: string
        }
        Insert: {
          correct?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          marks?: number
          option_a: string
          option_b: string
          option_c?: string | null
          option_d?: string | null
          order_index: number
          question_text: string
          test_id: string
        }
        Update: {
          correct?: string | null
          created_at?: string
          explanation?: string | null
          id?: string
          marks?: number
          option_a?: string
          option_b?: string
          option_c?: string | null
          option_d?: string | null
          order_index?: number
          question_text?: string
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      submissions: {
        Row: {
          correct_count: number
          id: string
          is_creator_submission: boolean
          rank: number | null
          score: number
          student_id: string
          submitted_at: string
          test_id: string
          time_taken_sec: number | null
          total_marks: number
          unanswered: number
          wrong_count: number
        }
        Insert: {
          correct_count: number
          id?: string
          is_creator_submission?: boolean
          rank?: number | null
          score: number
          student_id: string
          submitted_at?: string
          test_id: string
          time_taken_sec?: number | null
          total_marks: number
          unanswered: number
          wrong_count: number
        }
        Update: {
          correct_count?: number
          id?: string
          is_creator_submission?: boolean
          rank?: number | null
          score?: number
          student_id?: string
          submitted_at?: string
          test_id?: string
          time_taken_sec?: number | null
          total_marks?: number
          unanswered?: number
          wrong_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "submissions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      submission_answers: {
        Row: {
          chosen_option: string | null
          created_at: string
          id: string
          is_correct: boolean
          question_id: string
          submission_id: string
        }
        Insert: {
          chosen_option?: string | null
          created_at?: string
          id?: string
          is_correct: boolean
          question_id: string
          submission_id: string
        }
        Update: {
          chosen_option?: string | null
          created_at?: string
          id?: string
          is_correct?: boolean
          question_id?: string
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "submission_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submission_answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          body_preview: string | null
          educator_id: string
          id: string
          recipient_count: number
          sent_at: string
          subject: string
          test_id: string | null
        }
        Insert: {
          body_preview?: string | null
          educator_id: string
          id?: string
          recipient_count: number
          sent_at?: string
          subject: string
          test_id?: string | null
        }
        Update: {
          body_preview?: string | null
          educator_id?: string
          id?: string
          recipient_count?: number
          sent_at?: string
          subject?: string
          test_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_educator_id_fkey"
            columns: ["educator_id"]
            isOneToOne: false
            referencedRelation: "educators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_logs_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      student_public_profiles: {
        Row: {
          avatar_url: string | null
          id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

// ---- Convenience type aliases for TestLink tables ----
export type Educator = Tables<"educators">
export type Student = Tables<"students">
export type Plan = Tables<"plans">
export type Test = Tables<"tests">
export type Question = Tables<"questions">
export type Submission = Tables<"submissions">
export type SubmissionAnswer = Tables<"submission_answers">
export type StudentPublicProfile = Tables<"student_public_profiles">

// ---- Domain types used across the app ----
export type ParsedQuestion = {
  question_text: string
  option_a: string
  option_b: string
  option_c: string | null
  option_d: string | null
  correct: "a" | "b" | "c" | "d" | null
  marks: number
  explanation: string | null
  flagged?: boolean // true if AI couldn't determine correct answer
}
