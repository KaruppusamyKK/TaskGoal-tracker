import { useState, useEffect, useRef } from "react";
import { Send, X, User } from "lucide-react";
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { ApiService } from '../apiHandler/ApiService.js';

export default function CommentDialog({ isOpen, onClose, taskID }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [attachments, setAttachments] = useState([]);
  const commentContainerRef = useRef(null);
  const [client, setClient] = useState(null);

  useEffect(() => {
    if (commentContainerRef.current) {
      commentContainerRef.current.scrollTop = commentContainerRef.current.scrollHeight;
    }
  }, [comments]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/websocket");
    const stompClient = Stomp.over(socket);

    stompClient.debug = () => {};
    stompClient.connect(
      {},
      (frame) => {

        setClient(stompClient);

        stompClient.subscribe("/chatMessageTo/send", (message) => {
          alert("///////////////")
          try {
              const parsedMessage = JSON.parse(message.body);      
              const newComment = parsedMessage.body;
              console.log("Received are ",newComment)
      
              if (newComment) {
                  setComments((prevComments) => [...prevComments, newComment]);
              }
          } catch (error) {
              console.error("❌ Error parsing message:", error);
          }
      });
      
      },
      (error) => {
        console.error("❌ WebSocket Connection Error:", error);
      }
    );

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect(() => console.log("🔌 WebSocket disconnected"));
      }
    };
  }, []);

  



  const handleAddComment = async () => {
    if (!newComment.trim() && attachments.length === 0) return;

    const newCommentObj = {
      sender: localStorage.getItem("user"),
      avatar: null,
      content: newComment,
      taskId: taskID,
      time: "Just now",
    };


    if (client && client.connected) {
      client.send("/app/chatMessage", {}, JSON.stringify(newCommentObj));
    }

    setNewComment("");
    setAttachments([]);
  };


  useEffect(() => {
    if (taskID) {
      fetchChats();
    }
  }, [taskID]);

  const fetchChats = async () => {
    try {
      const responseMessage = await ApiService.fetchChats(taskID);
      setComments(responseMessage.map(msg => ({
        sender: msg.sender,
        content: msg.content,
        taskId: msg.taskId,
        time: new Date(msg.timestamp).toLocaleTimeString(),
        attachments: msg.attachments || []
      })));
    } catch (error) {
      console.log(error);
    }
  };


  

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };


  return (
    isOpen && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg w-[650px] max-h-[85vh] flex flex-col">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">Comments</h2>
            <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-gray-200 flex items-center justify-center">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={commentContainerRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-6 min-h-[300px] max-h-[400px]">
            {comments.map((comment, index) => (
              <div key={index} className="flex gap-4">
                <div className="h-10 w-10 flex items-center justify-center rounded-full border">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{comment.sender}</span>
                    <span className="text-xs text-gray-500">{comment.time}</span>
                  </div>
                  <p className="text-base leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 border-t bg-white">
            <div className="border rounded-lg flex flex-col shadow-sm">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Write a comment..."
                className="min-h-[120px] p-4 resize-none focus:outline-none"
              />
              <div className="flex items-center justify-between p-3 bg-gray-100 border-t">
                <button onClick={handleAddComment} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                  <Send className="h-4 w-4 inline-block mr-2" />
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
