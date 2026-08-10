export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: string;
  progress_label: string;
  progress_stats: string;
  progress_bar_fill: number;
  due_date: string | Date;
  assignee_initials_list: string[];
  created_at: string;
  assignee_names: string[];
}


export const tasks: Task[] = [
  {
    id: "1",
    title: "Learn Angular Control Flow",
    completed: true,
    priority: "High",
    progress_label: "Completion",
    progress_stats: "100%",
    progress_bar_fill: 100,
    due_date: new Date().toISOString(),
    assignee_initials_list: ["PM"],
    created_at: "Today",
    assignee_names: ["Priyanshu Mishra"]
  }
];
