"use client"
import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/ui/dotted-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, Trash2 } from "lucide-react";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { DataTable } from "./data-table";
import { columns as createColumns } from "./columns";
import { useGetFiles } from "@/features/files/api/use-get-file";
import { useQueryState } from "nuqs";
import { useToast } from '@/hooks/use-toast';
import { Toaster } from "@/components/ui/toaster";
import { deleteDocuments } from "../hooks/bolt/api";
import { RowSelectionState } from "@tanstack/react-table";
import { useConfirm } from "@/hooks/use-confirm";
import { DataCalender } from './data-calendar';


interface TaskViewsSwitcherProps {
  workspaceId: string;
}

export const TaskViewsSwitcher = ({ workspaceId }: TaskViewsSwitcherProps) => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [submittedFiles] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  const { toast } = useToast();
  const { open } = useCreateTaskModal();

  const { data: table, refetch } = useGetFiles({
    workspaceId,
  });

  const handleAddToKanban = useCallback((url: string, results: any[]) => {
    // Implement your add to Kanban logic here
    console.log('Adding to Kanban', url, results);
  }, []);
  const [DeleteDialog, confirmDelete] = useConfirm(
    "Delete project",
    "This action cannot be undone",
    "destructive",
 );

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if(!ok) return;
    const tableData = table?.documents ?? [];
    const selectedItems = tableData.filter((_, index) => 
      Object.keys(rowSelection).includes(index.toString())
    );
    const selectedImageUrls = selectedItems.map(item => item.imageUrl);
    
    if (selectedImageUrls.length === 0) {
      toast({
        title: "No Selection",
        description: "Please select items to delete",
        variant: "destructive",
      });
      return;
    }
  
    try {
      setIsDeleting(true);
      
      await deleteDocuments (selectedImageUrls);
      
      await refetch();
      setRowSelection({});
      
      toast({
        title: "Success",
        description: `Successfully deleted ${selectedImageUrls.length} item(s)`,
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete selected items",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <Toaster />
      <DeleteDialog/>
      <Tabs
        value={view}
        onValueChange={setView}
        className="flex-1 w-full border rounded-lg"
      >
        <div className="h-full flex-col overflow-auto p-4">
          <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
            <TabsList className="w-full lg:w-auto">
              <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
                Table
              </TabsTrigger>
             
              <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
                Calendar
              </TabsTrigger>
            </TabsList>
            <Button size="sm" className="w-full lg:w-auto" onClick={open}>
              <PlusIcon className="size-4 mr-2" />
              Upload
            </Button>
          </div>

          <DottedSeparator className="my-4" />
          <div className="flex justify-end">
            <Button
              variant="destructive" 
              size="sm"
              onClick={handleDelete}
              disabled={Object.keys(rowSelection).length === 0 || isDeleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
              {isDeleting && <span className="ml-2">...</span>}
            </Button>
          </div>
          
          <DottedSeparator className="my-4" />

          <TabsContent value="table" className="mt-0">
            <DataTable 
              columns={createColumns({ 
                handleAddToKanban,
                submittedFiles,
                onDelete: handleDelete,
              })} 
              data={table?.documents ?? []} 
              rowSelection={rowSelection}
              setRowSelection={setRowSelection} 
            />
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <DataCalender data={table?.documents ?? []}  />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};