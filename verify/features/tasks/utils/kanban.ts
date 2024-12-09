export type KanbanItem = {
    question: string;
    answer: string;
    status: 'Found' | 'Not Found';
  };
  
  export type KanbanColumn = {
    title: string;
    items: KanbanItem[];
    icon: React.ReactNode;
    badgeColor: "bg-green-100 text-green-800" | "bg-red-100 text-red-800";
  };