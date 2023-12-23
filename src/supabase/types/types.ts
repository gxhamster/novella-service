export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      books: {
        Row: {
          author: string | null
          created_at: string | null
          ddc: string | null
          edition: string | null
          genre: string | null
          id: number
          isbn: number | null
          language: string | null
          pages: number | null
          publisher: string | null
          searchcol: unknown | null
          times_issued: number | null
          times_returned: number | null
          title: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          author?: string | null
          created_at?: string | null
          ddc?: string | null
          edition?: string | null
          genre?: string | null
          id?: number
          isbn?: number | null
          language?: string | null
          pages?: number | null
          publisher?: string | null
          searchcol?: unknown | null
          times_issued?: number | null
          times_returned?: number | null
          title?: string | null
          user_id?: string
          year?: number | null
        }
        Update: {
          author?: string | null
          created_at?: string | null
          ddc?: string | null
          edition?: string | null
          genre?: string | null
          id?: number
          isbn?: number | null
          language?: string | null
          pages?: number | null
          publisher?: string | null
          searchcol?: unknown | null
          times_issued?: number | null
          times_returned?: number | null
          title?: string | null
          user_id?: string
          year?: number | null
        }
        Relationships: []
      }
      history: {
        Row: {
          book_id: number | null
          created_at: string
          due_date: string | null
          id: number
          issued_date: string | null
          returned_date: string | null
          student_id: number | null
          user_id: string | null
        }
        Insert: {
          book_id?: number | null
          created_at?: string
          due_date?: string | null
          id?: number
          issued_date?: string | null
          returned_date?: string | null
          student_id?: number | null
          user_id?: string | null
        }
        Update: {
          book_id?: number | null
          created_at?: string
          due_date?: string | null
          id?: number
          issued_date?: string | null
          returned_date?: string | null
          student_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "history_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      issued: {
        Row: {
          book_id: number
          created_at: string
          due_date: string | null
          id: number
          student_id: number
          user_id: string | null
        }
        Insert: {
          book_id: number
          created_at?: string
          due_date?: string | null
          id?: number
          student_id: number
          user_id?: string | null
        }
        Update: {
          book_id?: number
          created_at?: string
          due_date?: string | null
          id?: number
          student_id?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "issued_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: true
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "issued_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
      students: {
        Row: {
          address: string | null
          created_at: string
          grade: number | null
          id: number
          index: number
          island: string | null
          name: string | null
          phone: string | null
          searchcol: unknown | null
          times_borrowed: number | null
          times_returned: number | null
          user_id: string
          name_index: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          grade?: number | null
          id?: number
          index: number
          island?: string | null
          name?: string | null
          phone?: string | null
          searchcol?: unknown | null
          times_borrowed?: number | null
          times_returned?: number | null
          user_id?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          grade?: number | null
          id?: number
          index?: number
          island?: string | null
          name?: string | null
          phone?: string | null
          searchcol?: unknown | null
          times_borrowed?: number | null
          times_returned?: number | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      get_grade_values: {
        Row: {
          grade: number | null
        }
        Relationships: []
      }
      get_most_popular_student: {
        Row: {
          count: number | null
          name: string | null
          student_id: number | null
        }
        Relationships: [
          {
            foreignKeyName: "history_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Functions: {
      name_index: {
        Args: {
          "": unknown
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
