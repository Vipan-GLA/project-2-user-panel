import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Package, Video } from 'lucide-react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

interface Order {
  id: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  createdAt: string;
}

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomID, setRoomID] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, 'orders')
        );

        const querySnapshot = await getDocs(q);
        const orderData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        setOrders(orderData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  // Generate Kit Token & Start Meeting
  const startVideoCall = async (orderId: string) => {
    const appID = 2118052849; // 🔹 Replace with your App ID
    const serverSecret = "59d3476834a436035eccb100c5189daf"; // 🔹 Replace with your Secret Key
    const userID = user?.uid || `guest_${Math.floor(Math.random() * 1000)}`;
    const userName = user?.displayName || "Guest";

    setRoomID(orderId);

    // Generate Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      orderId,
      userID,
      userName
    );

    // Create Zego UIKit Instance
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Join Room
    zp.joinRoom({
      container: document.getElementById('zego-video-container') as HTMLElement,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role: ZegoUIKitPrebuilt.Host, // Cook is the host
        },
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Order History</h2>

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 hover:bg-gray-50"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-sm text-gray-600">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2"
                  onClick={() => startVideoCall(order.id)}
                >
                  <Video className="h-4 w-4" /> Watch Cooking
                </button>
              </div>
              <div className="space-y-2">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Call UI */}
      {roomID && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Live Cooking Video</h3>

            <div id="zego-video-container" className="w-full h-96 bg-black rounded-lg"></div>

            <button
              onClick={() => setRoomID(null)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg"
            >
              End Call
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
