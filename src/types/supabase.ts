export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      _prisma_migrations: {
        Row: {
          applied_steps_count: number
          checksum: string
          finished_at: string | null
          id: string
          logs: string | null
          migration_name: string
          rolled_back_at: string | null
          started_at: string
        }
        Insert: {
          applied_steps_count?: number
          checksum: string
          finished_at?: string | null
          id: string
          logs?: string | null
          migration_name: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Update: {
          applied_steps_count?: number
          checksum?: string
          finished_at?: string | null
          id?: string
          logs?: string | null
          migration_name?: string
          rolled_back_at?: string | null
          started_at?: string
        }
        Relationships: []
      }
      Account: {
        Row: {
          accessToken: string | null
          accessTokenExpires: string | null
          createdAt: string
          id: string
          providerAccountId: string
          providerId: string
          providerType: string
          refreshToken: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          accessToken?: string | null
          accessTokenExpires?: string | null
          createdAt?: string
          id: string
          providerAccountId: string
          providerId: string
          providerType: string
          refreshToken?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          accessToken?: string | null
          accessTokenExpires?: string | null
          createdAt?: string
          id?: string
          providerAccountId?: string
          providerId?: string
          providerType?: string
          refreshToken?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Account_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Appointment: {
        Row: {
          createdAt: string
          date: string
          doctorId: string
          endTime: string
          id: string
          patientId: string
          reason: string
          startTime: string
          status: Database["public"]["Enums"]["AppointmentStatus"]
          tenantId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          date: string
          doctorId: string
          endTime: string
          id: string
          patientId: string
          reason: string
          startTime: string
          status: Database["public"]["Enums"]["AppointmentStatus"]
          tenantId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          date?: string
          doctorId?: string
          endTime?: string
          id?: string
          patientId?: string
          reason?: string
          startTime?: string
          status?: Database["public"]["Enums"]["AppointmentStatus"]
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Appointment_doctorId_fkey"
            columns: ["doctorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Appointment_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "Patient"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Appointment_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      Billing: {
        Row: {
          amount: number
          createdAt: string
          id: string
          patientId: string
          paymentMethod: Database["public"]["Enums"]["PaymentMethod"]
          status: Database["public"]["Enums"]["BillingStatus"]
          tenantId: string
          treatmentId: string | null
          updatedAt: string
          userId: string
        }
        Insert: {
          amount: number
          createdAt?: string
          id: string
          patientId: string
          paymentMethod: Database["public"]["Enums"]["PaymentMethod"]
          status: Database["public"]["Enums"]["BillingStatus"]
          tenantId: string
          treatmentId?: string | null
          updatedAt: string
          userId: string
        }
        Update: {
          amount?: number
          createdAt?: string
          id?: string
          patientId?: string
          paymentMethod?: Database["public"]["Enums"]["PaymentMethod"]
          status?: Database["public"]["Enums"]["BillingStatus"]
          tenantId?: string
          treatmentId?: string | null
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Billing_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "Patient"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Billing_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Billing_treatmentId_fkey"
            columns: ["treatmentId"]
            isOneToOne: false
            referencedRelation: "Treatment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Billing_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Configuration: {
        Row: {
          createdAt: string
          id: string
          key: string
          tenantId: string
          updatedAt: string
          value: Json
        }
        Insert: {
          createdAt?: string
          id: string
          key: string
          tenantId: string
          updatedAt: string
          value: Json
        }
        Update: {
          createdAt?: string
          id?: string
          key?: string
          tenantId?: string
          updatedAt?: string
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "Configuration_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      Customer: {
        Row: {
          createdAt: string
          email: string | null
          id: string
          name: string
          phone: string | null
          tenantId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email?: string | null
          id: string
          name: string
          phone?: string | null
          tenantId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Customer_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      Inventory: {
        Row: {
          createdAt: string
          expirationDate: string | null
          id: string
          location: Database["public"]["Enums"]["InventoryLocation"] | null
          medicationId: string
          quantity: number
          tenantId: string
          threshold: number
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          expirationDate?: string | null
          id: string
          location?: Database["public"]["Enums"]["InventoryLocation"] | null
          medicationId: string
          quantity: number
          tenantId: string
          threshold: number
          updatedAt: string
        }
        Update: {
          createdAt?: string
          expirationDate?: string | null
          id?: string
          location?: Database["public"]["Enums"]["InventoryLocation"] | null
          medicationId?: string
          quantity?: number
          tenantId?: string
          threshold?: number
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Inventory_medicationId_fkey"
            columns: ["medicationId"]
            isOneToOne: false
            referencedRelation: "Medication"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Inventory_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      InventoryLog: {
        Row: {
          changeType: Database["public"]["Enums"]["ChangeType"]
          createdAt: string
          id: string
          inventoryId: string
          quantityChange: number
          reason: string | null
          timestamp: string
          updatedAt: string
        }
        Insert: {
          changeType: Database["public"]["Enums"]["ChangeType"]
          createdAt?: string
          id: string
          inventoryId: string
          quantityChange: number
          reason?: string | null
          timestamp?: string
          updatedAt?: string
        }
        Update: {
          changeType?: Database["public"]["Enums"]["ChangeType"]
          createdAt?: string
          id?: string
          inventoryId?: string
          quantityChange?: number
          reason?: string | null
          timestamp?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "InventoryLog_inventoryId_fkey"
            columns: ["inventoryId"]
            isOneToOne: false
            referencedRelation: "Inventory"
            referencedColumns: ["id"]
          },
        ]
      }
      Invitation: {
        Row: {
          createdAt: string
          email: string
          expiresAt: string
          id: string
          roleId: string
          status: Database["public"]["Enums"]["InvitationStatus"]
          tenantId: string
          token: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          expiresAt: string
          id: string
          roleId: string
          status?: Database["public"]["Enums"]["InvitationStatus"]
          tenantId: string
          token: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          expiresAt?: string
          id?: string
          roleId?: string
          status?: Database["public"]["Enums"]["InvitationStatus"]
          tenantId?: string
          token?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Invitation_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Invitation_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      MedicalCheckup: {
        Row: {
          appointmentId: string | null
          bloodPressure: string
          bmi: number | null
          checkupDate: string
          createdAt: string
          doctorId: string
          heartRate: number
          height: number | null
          id: string
          medicalRecordId: string | null
          notes: string | null
          oxygenSaturation: number | null
          patientId: string
          respiratoryRate: number | null
          temperature: number | null
          tenantId: string
          updatedAt: string
          weight: number | null
        }
        Insert: {
          appointmentId?: string | null
          bloodPressure: string
          bmi?: number | null
          checkupDate?: string
          createdAt?: string
          doctorId: string
          heartRate: number
          height?: number | null
          id: string
          medicalRecordId?: string | null
          notes?: string | null
          oxygenSaturation?: number | null
          patientId: string
          respiratoryRate?: number | null
          temperature?: number | null
          tenantId: string
          updatedAt: string
          weight?: number | null
        }
        Update: {
          appointmentId?: string | null
          bloodPressure?: string
          bmi?: number | null
          checkupDate?: string
          createdAt?: string
          doctorId?: string
          heartRate?: number
          height?: number | null
          id?: string
          medicalRecordId?: string | null
          notes?: string | null
          oxygenSaturation?: number | null
          patientId?: string
          respiratoryRate?: number | null
          temperature?: number | null
          tenantId?: string
          updatedAt?: string
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "MedicalCheckup_appointmentId_fkey"
            columns: ["appointmentId"]
            isOneToOne: false
            referencedRelation: "Appointment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MedicalCheckup_doctorId_fkey"
            columns: ["doctorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MedicalCheckup_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "Patient"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MedicalCheckup_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      MedicalRecord: {
        Row: {
          appointmentId: string | null
          checkupId: string | null
          createdAt: string
          doctorId: string
          followUp: Database["public"]["Enums"]["FollowUpPeriod"]
          id: string
          patientId: string
          reasonForVisit: string
          tenantId: string
          treatmentId: string | null
          updatedAt: string
          visitDate: string
        }
        Insert: {
          appointmentId?: string | null
          checkupId?: string | null
          createdAt?: string
          doctorId: string
          followUp: Database["public"]["Enums"]["FollowUpPeriod"]
          id: string
          patientId: string
          reasonForVisit: string
          tenantId: string
          treatmentId?: string | null
          updatedAt: string
          visitDate?: string
        }
        Update: {
          appointmentId?: string | null
          checkupId?: string | null
          createdAt?: string
          doctorId?: string
          followUp?: Database["public"]["Enums"]["FollowUpPeriod"]
          id?: string
          patientId?: string
          reasonForVisit?: string
          tenantId?: string
          treatmentId?: string | null
          updatedAt?: string
          visitDate?: string
        }
        Relationships: [
          {
            foreignKeyName: "MedicalRecord_appointmentId_fkey"
            columns: ["appointmentId"]
            isOneToOne: false
            referencedRelation: "Appointment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MedicalRecord_checkupId_fkey"
            columns: ["checkupId"]
            isOneToOne: false
            referencedRelation: "MedicalCheckup"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MedicalRecord_doctorId_fkey"
            columns: ["doctorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MedicalRecord_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "Patient"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MedicalRecord_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "MedicalRecord_treatmentId_fkey"
            columns: ["treatmentId"]
            isOneToOne: false
            referencedRelation: "Treatment"
            referencedColumns: ["id"]
          },
        ]
      }
      Medication: {
        Row: {
          createdAt: string
          description: string | null
          id: string
          name: string
          price: number
          tenantId: string
          unit: Database["public"]["Enums"]["MedicationUnit"]
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          description?: string | null
          id: string
          name: string
          price: number
          tenantId: string
          unit: Database["public"]["Enums"]["MedicationUnit"]
          updatedAt: string
        }
        Update: {
          createdAt?: string
          description?: string | null
          id?: string
          name?: string
          price?: number
          tenantId?: string
          unit?: Database["public"]["Enums"]["MedicationUnit"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Medication_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      Patient: {
        Row: {
          address: string
          createdAt: string
          dateOfBirth: string | null
          email: string
          id: string
          medicalHistory: string | null
          name: string
          phone: string
          tenantId: string
          updatedAt: string
        }
        Insert: {
          address: string
          createdAt?: string
          dateOfBirth?: string | null
          email: string
          id: string
          medicalHistory?: string | null
          name: string
          phone: string
          tenantId: string
          updatedAt: string
        }
        Update: {
          address?: string
          createdAt?: string
          dateOfBirth?: string | null
          email?: string
          id?: string
          medicalHistory?: string | null
          name?: string
          phone?: string
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Patient_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      Permission: {
        Row: {
          action: Database["public"]["Enums"]["PermissionAction"]
          id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["PermissionAction"]
          id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["PermissionAction"]
          id?: string
        }
        Relationships: []
      }
      Prescription: {
        Row: {
          createdAt: string
          doctorId: string
          dosage: Database["public"]["Enums"]["Dosage"]
          duration: Database["public"]["Enums"]["Duration"]
          frequency: Database["public"]["Enums"]["Frequency"]
          id: string
          instructions: string | null
          medicationId: string
          patientId: string
          tenantId: string
          treatmentId: string | null
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          doctorId: string
          dosage: Database["public"]["Enums"]["Dosage"]
          duration: Database["public"]["Enums"]["Duration"]
          frequency: Database["public"]["Enums"]["Frequency"]
          id: string
          instructions?: string | null
          medicationId: string
          patientId: string
          tenantId: string
          treatmentId?: string | null
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          doctorId?: string
          dosage?: Database["public"]["Enums"]["Dosage"]
          duration?: Database["public"]["Enums"]["Duration"]
          frequency?: Database["public"]["Enums"]["Frequency"]
          id?: string
          instructions?: string | null
          medicationId?: string
          patientId?: string
          tenantId?: string
          treatmentId?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Prescription_doctorId_fkey"
            columns: ["doctorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Prescription_medicationId_fkey"
            columns: ["medicationId"]
            isOneToOne: false
            referencedRelation: "Medication"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Prescription_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "Patient"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Prescription_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Prescription_treatmentId_fkey"
            columns: ["treatmentId"]
            isOneToOne: false
            referencedRelation: "Treatment"
            referencedColumns: ["id"]
          },
        ]
      }
      Receipt: {
        Row: {
          content: Json
          createdAt: string
          id: string
          saleId: string
          updatedAt: string
        }
        Insert: {
          content: Json
          createdAt?: string
          id: string
          saleId: string
          updatedAt?: string
        }
        Update: {
          content?: Json
          createdAt?: string
          id?: string
          saleId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Receipt_saleId_fkey"
            columns: ["saleId"]
            isOneToOne: false
            referencedRelation: "Sale"
            referencedColumns: ["id"]
          },
        ]
      }
      Role: {
        Row: {
          description: string
          id: string
          name: string
        }
        Insert: {
          description: string
          id: string
          name: string
        }
        Update: {
          description?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      RolePermission: {
        Row: {
          id: string
          permissionId: string
          roleId: string
        }
        Insert: {
          id: string
          permissionId: string
          roleId: string
        }
        Update: {
          id?: string
          permissionId?: string
          roleId?: string
        }
        Relationships: [
          {
            foreignKeyName: "RolePermission_permissionId_fkey"
            columns: ["permissionId"]
            isOneToOne: false
            referencedRelation: "Permission"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "RolePermission_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Role"
            referencedColumns: ["id"]
          },
        ]
      }
      Sale: {
        Row: {
          createdAt: string
          customerId: string | null
          id: string
          paymentMethod: Database["public"]["Enums"]["PaymentMethod"]
          paymentStatus: Database["public"]["Enums"]["PaymentStatus"]
          tenantId: string
          totalAmount: number
          updatedAt: string
          userId: string
        }
        Insert: {
          createdAt?: string
          customerId?: string | null
          id: string
          paymentMethod: Database["public"]["Enums"]["PaymentMethod"]
          paymentStatus?: Database["public"]["Enums"]["PaymentStatus"]
          tenantId: string
          totalAmount: number
          updatedAt?: string
          userId: string
        }
        Update: {
          createdAt?: string
          customerId?: string | null
          id?: string
          paymentMethod?: Database["public"]["Enums"]["PaymentMethod"]
          paymentStatus?: Database["public"]["Enums"]["PaymentStatus"]
          tenantId?: string
          totalAmount?: number
          updatedAt?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Sale_customerId_fkey"
            columns: ["customerId"]
            isOneToOne: false
            referencedRelation: "Customer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Sale_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Sale_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      SaleItem: {
        Row: {
          createdAt: string
          id: string
          medicationId: string
          price: number
          quantity: number
          saleId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          id: string
          medicationId: string
          price: number
          quantity: number
          saleId: string
          updatedAt?: string
        }
        Update: {
          createdAt?: string
          id?: string
          medicationId?: string
          price?: number
          quantity?: number
          saleId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "SaleItem_medicationId_fkey"
            columns: ["medicationId"]
            isOneToOne: false
            referencedRelation: "Medication"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SaleItem_saleId_fkey"
            columns: ["saleId"]
            isOneToOne: false
            referencedRelation: "Sale"
            referencedColumns: ["id"]
          },
        ]
      }
      Session: {
        Row: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Insert: {
          expires: string
          id: string
          sessionToken: string
          userId: string
        }
        Update: {
          expires?: string
          id?: string
          sessionToken?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "Session_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Tenant: {
        Row: {
          address: string
          contactEmail: string
          contactPhone: string
          createdAt: string
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          address: string
          contactEmail: string
          contactPhone: string
          createdAt?: string
          id: string
          name: string
          updatedAt: string
        }
        Update: {
          address?: string
          contactEmail?: string
          contactPhone?: string
          createdAt?: string
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      Treatment: {
        Row: {
          appointmentId: string | null
          createdAt: string
          description: string
          doctorId: string
          id: string
          medicalRecordId: string | null
          patientId: string
          tenantId: string
          treatmentDate: string
          type: Database["public"]["Enums"]["TreatmentType"]
          updatedAt: string
        }
        Insert: {
          appointmentId?: string | null
          createdAt?: string
          description: string
          doctorId: string
          id: string
          medicalRecordId?: string | null
          patientId: string
          tenantId: string
          treatmentDate?: string
          type: Database["public"]["Enums"]["TreatmentType"]
          updatedAt: string
        }
        Update: {
          appointmentId?: string | null
          createdAt?: string
          description?: string
          doctorId?: string
          id?: string
          medicalRecordId?: string | null
          patientId?: string
          tenantId?: string
          treatmentDate?: string
          type?: Database["public"]["Enums"]["TreatmentType"]
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "Treatment_appointmentId_fkey"
            columns: ["appointmentId"]
            isOneToOne: false
            referencedRelation: "Appointment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Treatment_doctorId_fkey"
            columns: ["doctorId"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Treatment_patientId_fkey"
            columns: ["patientId"]
            isOneToOne: false
            referencedRelation: "Patient"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Treatment_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          createdAt: string
          email: string
          emailVerified: string | null
          hashedPassword: string | null
          id: string
          image: string | null
          name: string
          phone: string | null
          resetToken: string | null
          resetTokenExpiry: string | null
          roleId: string
          tenantId: string
          updatedAt: string
        }
        Insert: {
          createdAt?: string
          email: string
          emailVerified?: string | null
          hashedPassword?: string | null
          id: string
          image?: string | null
          name: string
          phone?: string | null
          resetToken?: string | null
          resetTokenExpiry?: string | null
          roleId: string
          tenantId: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          emailVerified?: string | null
          hashedPassword?: string | null
          id?: string
          image?: string | null
          name?: string
          phone?: string | null
          resetToken?: string | null
          resetTokenExpiry?: string | null
          roleId?: string
          tenantId?: string
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_roleId_fkey"
            columns: ["roleId"]
            isOneToOne: false
            referencedRelation: "Role"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "User_tenantId_fkey"
            columns: ["tenantId"]
            isOneToOne: false
            referencedRelation: "Tenant"
            referencedColumns: ["id"]
          },
        ]
      }
      VerificationToken: {
        Row: {
          expires: string
          id: string
          identifier: string
          token: string
        }
        Insert: {
          expires: string
          id: string
          identifier: string
          token: string
        }
        Update: {
          expires?: string
          id?: string
          identifier?: string
          token?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      AppointmentStatus: "SCHEDULED" | "COMPLETED" | "CANCELLED"
      BillingStatus: "UNPAID" | "PAID" | "PENDING"
      ChangeType: "ADDITION" | "SUBTRACTION" | "ADJUSTMENT"
      Dosage:
        | "ONE_TABLET"
        | "TWO_TABLETS"
        | "HALF_TABLET"
        | "ONE_QUARTER_TABLET"
        | "THREE_TABLETS"
        | "FOUR_TABLETS"
        | "ONE_CAPSULE"
        | "TWO_CAPSULES"
        | "HALF_CAPSULE"
        | "ONE_QUARTER_CAPSULE"
        | "THREE_CAPSULES"
        | "FOUR_CAPSULES"
        | "ONE_SPOON"
        | "TWO_SPOONS"
        | "HALF_SPOON"
        | "ONE_QUARTER_SPOON"
      Duration:
        | "ONE_DAY"
        | "TWO_DAYS"
        | "THREE_DAYS"
        | "FIVE_DAYS"
        | "ONE_WEEK"
        | "TWO_WEEKS"
        | "THREE_WEEKS"
        | "ONE_MONTH"
        | "THREE_MONTHS"
        | "SIX_MONTHS"
        | "NINE_MONTHS"
        | "ONE_YEAR"
      FollowUpPeriod:
        | "NO_FOLLOW_UP"
        | "ONE_DAY"
        | "THREE_DAYS"
        | "ONE_WEEK"
        | "TWO_WEEKS"
        | "THREE_WEEKS"
        | "ONE_MONTH"
        | "SIX_WEEKS"
        | "TWO_MONTHS"
        | "THREE_MONTHS"
        | "SIX_MONTHS"
        | "NINE_MONTHS"
        | "ONE_YEAR"
        | "TWO_YEARS"
        | "THREE_YEARS"
      Frequency:
        | "ONCE_A_DAY"
        | "TWICE_A_DAY"
        | "THRICE_A_DAY"
        | "EVERY_FOUR_HOURS"
        | "EVERY_SIX_HOURS"
        | "EVERY_EIGHT_HOURS"
        | "EVERY_TWELVE_HOURS"
        | "EVERY_OTHER_DAY"
        | "ONCE_A_WEEK"
        | "TWICE_A_WEEK"
        | "THRICE_A_WEEK"
        | "ONCE_A_MONTH"
      InventoryLocation:
        | "WAREHOUSE"
        | "FRONT_STORE"
        | "DISPENSARY"
        | "COLD_STORAGE"
        | "REFRIGERATOR"
        | "SHELF"
        | "COUNTER"
      InvitationStatus: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED"
      MedicationUnit:
        | "PILLS"
        | "TABLETS"
        | "CAPSULES"
        | "BOTTLES"
        | "VIALS"
        | "AMPOULES"
        | "BOXES"
        | "SACHETS"
        | "SPRAY"
        | "BLISTERS"
        | "MILLILITERS"
        | "GRAMS"
        | "MICROGRAMS"
        | "LITERS"
        | "TEASPOONS"
        | "TABLESPOONS"
        | "OZ"
        | "IU"
        | "PUFFS"
        | "PACKS"
        | "TUBES"
        | "PATCHES"
        | "KITS"
      PaymentMethod: "MPESA" | "CASH" | "CREDIT_CARD" | "INSURANCE" | "OTHER"
      PaymentStatus: "PENDING" | "COMPLETED" | "FAILED"
      PermissionAction:
        | "ACCESS_ADMIN_DASHBOARD"
        | "MANAGE_TENANTS"
        | "MANAGE_ROLES"
        | "MANAGE_PERMISSIONS"
        | "VIEW_AUDIT_LOGS"
        | "MANAGE_BILLING"
        | "VIEW_ALL_DATA"
        | "MANAGE_SUBSCRIPTIONS"
        | "MANAGE_STAFF"
        | "VIEW_STAFF"
        | "ASSIGN_ROLES"
        | "VIEW_PATIENT_RECORDS"
        | "EDIT_PATIENT_RECORDS"
        | "CREATE_PATIENT_RECORDS"
        | "DELETE_PATIENT_RECORDS"
        | "VIEW_PATIENT_HISTORY"
        | "MANAGE_PATIENT_CONSENTS"
        | "SCHEDULE_APPOINTMENTS"
        | "VIEW_APPOINTMENTS"
        | "EDIT_APPOINTMENTS"
        | "CANCEL_APPOINTMENTS"
        | "VIEW_APPOINTMENT_HISTORY"
        | "CREATE_TREATMENT_PLANS"
        | "VIEW_TREATMENT_PLANS"
        | "EDIT_TREATMENT_PLANS"
        | "DELETE_TREATMENT_PLANS"
        | "PRESCRIBE_MEDICATION"
        | "ADMINISTER_TREATMENTS"
        | "SEND_MESSAGES"
        | "VIEW_MESSAGES"
        | "MANAGE_NOTIFICATIONS"
        | "VIEW_INVENTORY"
        | "MANAGE_INVENTORY"
        | "ORDER_SUPPLIES"
        | "VIEW_SUPPLY_ORDERS"
        | "VIEW_FINANCIAL_RECORDS"
        | "MANAGE_EXPENSES"
        | "VIEW_INSURANCE_CLAIMS"
        | "MANAGE_INSURANCE_CLAIMS"
        | "VIEW_REPORTS"
        | "GENERATE_REPORTS"
        | "EXPORT_DATA"
        | "MANAGE_USER_ACCOUNTS"
        | "RESET_USER_PASSWORDS"
        | "DEACTIVATE_USER_ACCOUNTS"
        | "VIEW_SALES"
        | "CREATE_SALES"
        | "EDIT_SALES"
        | "DELETE_SALES"
        | "VIEW_MEDICATIONS"
        | "CREATE_MEDICATIONS"
        | "EDIT_MEDICATIONS"
        | "DELETE_MEDICATIONS"
        | "VIEW_INVENTORY_CHANGES"
        | "MANAGE_INVENTORY_CHANGES"
      TreatmentType: "MEDICATION" | "THERAPY" | "SURGERY" | "OTHER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
