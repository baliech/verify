import { getCurrent } from "@/features/auth/queries";
import { getWorkSpace } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-workspace-form";

interface WorkspaceIdSettingsPageProps {
    params:{
        workspaceId: string;
    };
};


const WorkspaceIdSettingsPage = async ({
    params,

}:WorkspaceIdSettingsPageProps)=>{
    const user = await getCurrent();
    if (!user) redirect("/sign-in");
    const initialValues = await getWorkSpace({workspaceId: params.workspaceId});
    

 return(
    <div className="w-full lg:max-w-xl" >
       <EditWorkspaceForm  initialValues={initialValues}/>
    </div>
 )

}

export default WorkspaceIdSettingsPage;