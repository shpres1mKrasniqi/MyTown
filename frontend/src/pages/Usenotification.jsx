import { useEffect, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { ToastContainer } from "react-toastify";
import { notificationService } from "../services/notificationService";

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

    const connection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7214/hubs/notifications")
        .withAutomaticReconnect()
        .build();

    connection
        .start()
        .then(() => {
            console.log("SignalR u lidh");
            
            // KJO ËSHTË E RËNDËSISHME:
            // Thirret metoda në Backend për t'u bërë pjesë e grupit Staff
            connection.invoke("JoinStaffGroup").catch(err => console.error(err));

            connection.on("ReceiveNotification", (data) => {
                setNotifications((prev) => [data, ...prev]);
            });
        })
        .catch((err) => console.error("SignalR error:", err));

    return () => {
        connection.stop();
    };
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
