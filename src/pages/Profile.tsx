import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { Package, Video, Clock, CheckCircle } from 'lucide-react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
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
          collection(db, 'orders'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
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

  const getOrderStatus = (createdAt: string) => {
    const orderTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    return (currentTime - orderTime) < (3 * 60 * 1000) ? 'processing' : 'delivered';
  };

  const isOrderRecent = (createdAt: string) => {
    const orderTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    return (currentTime - orderTime) < (3 * 60 * 1000);
  };

  const startVideoCall = async (orderId: string) => {
    const appID = 1255979506;
    const serverSecret = "632294e8c48e38559c98b5de3be30ef4";
    const userID = user?.uid || `guest_${Math.floor(Math.random() * 1000)}`;
    const userName = user?.displayName || "Guest";

    setRoomID(orderId);

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      orderId,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: document.getElementById('zego-video-container') as HTMLElement,
      scenario: {
        mode: ZegoUIKitPrebuilt.LiveStreaming,
        config: {
          role: ZegoUIKitPrebuilt.Host,
        },
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-6">Your Order History</h2>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">You haven't placed any orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-4">
                <div>
                  <h3 className="font-medium text-lg">Order #{order.id.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  {order.address && (
                    <div className="mt-2 text-sm text-gray-600">
                      <p>Deliver to: {order.address.street}, {order.address.city}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${getOrderStatus(order.createdAt) === 'processing'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                    }`}>
                    {getOrderStatus(order.createdAt) === 'processing' ? (
                      <>
                        <Clock className="h-4 w-4" /> Processing
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4" /> Delivered
                      </>
                    )}
                  </div>

                  {isOrderRecent(order.createdAt) && (
                    <button
                      onClick={() => startVideoCall(order.id)}
                      className="px-3 py-1 rounded-full bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      <Video className="h-4 w-4" /> Watch Cooking
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Your Items</h4>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="w-16 h-16 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 flex justify-end">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Subtotal: ${(order.total * 0.9).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Tax (10%): ${(order.total * 0.1).toFixed(2)}</p>
                  <p className="font-bold text-lg mt-1">Total: ${order.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {roomID && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Live Cooking Session</h3>
              <button
                onClick={() => setRoomID(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div id="zego-video-container" className="w-full h-96 bg-black rounded-lg"></div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setRoomID(null)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}