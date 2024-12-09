export interface Files {
    id: string;
    name: string;
    imageUrl: string;
    timeAdded: string;
  }
  
  export interface KanbanItem {
    question: string;
    answer: string;
    status: "Found" | "Not Found";
  }