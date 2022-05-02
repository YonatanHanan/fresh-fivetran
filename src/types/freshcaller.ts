declare module FreshCaller {
  export interface Team {
    id: number;
    name: string;
    description: string;
    users: User[];
    omni_channel: boolean;
  }

  export interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    status: number;
    preference: number;
    mobile_app_preference: number;
    last_call_time: Date;
    last_seen_time: Date;
    confirmed: boolean;
    language?: any;
    time_zone: string;
    deleted: boolean;
    role: string;
    teams: Team[];
  }

  export interface UserStatus {
    id: number;
    name: string;
    status_type: string;
    status_sub_type: string;
    emoji: string;
    enabled: number;
  }

  export interface Recording {
    id: number;
    url: string;
    duration: number;
    duration_unit: string;
  }

  export interface Participant {
    id: number;
    call_id: number;
    caller_id: number;
    caller_number: string;
    participant_id: number;
    participant_type: string;
    connection_type: number;
    call_status: number;
    duration: number;
    duration_unit: string;
    cost: number;
    cost_unit: string;
    enqueued_time?: any;
    created_time: Date;
    updated_time: Date;
  }

  export interface Call {
    id: number;
    direction: string;
    parent_call_id?: any;
    root_call_id?: any;
    phone_number_id: number;
    phone_number: string;
    assigned_agent_id?: any;
    assigned_team_id?: any;
    assigned_call_queue_id: number;
    assigned_ivr_id?: any;
    call_notes: string;
    bill_duration: number;
    bill_duration_unit: string;
    created_time: Date;
    updated_time: Date;
    recording: Recording;
    participants: Participant[];
  }

  export interface CallMetric {
    id: number;
    call_id: number;
    ivr_time: number;
    ivr_time_unit: string;
    hold_duration: number;
    hold_duration_unit: string;
    call_work_time: number;
    call_work_time_unit: string;
    total_ringing_time: number;
    total_ringing_time_unit: string;
    talk_time: number;
    talk_time_unit: string;
    answering_speed?: any;
    answering_speed_unit: string;
    recording_duration: number;
    recording_duration_unit: string;
    bill_duration?: any;
    bill_duration_unit: string;
    cost?: any;
    cost_unit: string;
    created_time: Date;
    updated_time: Date;
  }
}
