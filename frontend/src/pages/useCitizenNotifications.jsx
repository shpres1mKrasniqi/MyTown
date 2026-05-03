import { useEffect, useState, useCallback } from "react";
import * as signalR from "@microsoft/signalr";
import { notificationService } from "../services/notificationService";

export function useCitizenNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

   const fetchNotifications = useCallback(async () => {
    try {
        const res = await notificationService.getAll();
        
        const eventNotifications = res.data.filter((n) => 
            n.message.toLowerCase().includes("event")
        );
        setNotifications(eventNotifications);
    } catch (err) {
        console.error("Gabim gjate marrjes se njoftimeve");
    } finally {
        setLoading(false);
    }
}, []);

    useEffect(() => {
        fetchNotifications();

        const connection = new signalR.HubConnectionBuilder()
            .withUrl("https://localhost:7214/hubs/events")
            .withAutomaticReconnect()
            .build();

       connection.start().then(() => {
    // ✅ Njejte si stafi - JoinCitizenGroup
    connection.invoke("JoinCitizenGroup")
        .catch(err => console.error(err));

    connection.on("EventPublished", (data) => {
        const newNotification = {
            id: Date.now(),
            message: `🎉 Event i ri: ${data.ev?.title}`,
            isRead: false,
            createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [newNotification, ...prev]);
    });
       
           

               connection.on("EventWinnerAnnounced", (data) => {
                const newNotification = {
                    id: Date.now(),
                    message: `🏆 ${data.message}`,
                    isRead: false,
                    createdAt: new Date().toISOString(),
                };
                setNotifications((prev) => [newNotification, ...prev]);
            });

        }).catch((err) => console.error("SignalR error:", err));

        return () => connection.stop();
    }, [fetchNotifications]);

    const markAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications((prev) =>
                prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.log("Gabim gjate leximit:", err);
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