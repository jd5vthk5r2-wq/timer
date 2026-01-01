export interface Task {
    id: number;
    taskTitle: string;
    remainingTime: number;
    durationString: string;
}

export interface TaskTemplate {
    id: number;
    taskTitle: string;
    duration: number;
}

export interface Preset {
    id: number;
    name: string;
    tasks: TaskTemplate[];
}
