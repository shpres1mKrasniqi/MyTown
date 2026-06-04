import { useEffect, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { ToastContainer } from "react-toastify";
import { notificationService } from "../services/notificationService";
import { toast } from "react-toastify";
import { currentUser } from "../services/authService";

export function useNotifications(userId) {
    const [notifications, setNotifications] = useState([]);
    const [loading,setLoading] = useState(true);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const fetchNotifications = useCallback(async () =>{
        try{
            const res = await notificationService.getAll();
            setNotifications(res.data);
        }catch (err){
            toast.error("Gabim gjate marrjes se njoftimeve");
        }finally{
            setLoading(false);
        }
    },[]);

   
useEffect(() => {
    fetchNotifications();

    let connection;

    const startConnection = async () => {
        const user = await currentUser();
       
        const userId = user?.userId; 

     
    

        connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7214/hubs/notifications")
            .withAutomaticReconnect()
            .build();

    connection.start().then(() => {
    connection.invoke("JoinUserGroup", userId.toString()).catch(console.error);
    connection.invoke("JoinCitizenGroup").catch(console.error); 

    connection.on("ReceiveNotification", async () => {
        await fetchNotifications();
    });
});
    };

    startConnection();

    return () => connection?.stop();
}, [fetchNotifications]);

    const markAsRead = async (id) => {
        try{
            await notificationService.markAsRead(id);
            setNotifications((prev) => prev.map((n)=> (n.id == id ? {
                ...n, isRead: true
            }:n))
        );
        }catch(err){
            console.log("Gabim gjate leximit te njoftimit:", err);
        }
    };
    const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Gabim gjatë shënimit të të gjithave:", err);
    }
  };
 
  return { notifications, unreadCount, loading, markAsRead, markAllAsRead };
}
