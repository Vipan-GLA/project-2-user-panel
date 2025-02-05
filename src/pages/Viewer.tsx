import { useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';

interface ViewerProps {
    roomID: string;
    onClose: () => void;
}

export default function Viewer({ roomID, onClose }: ViewerProps) {
    const appID = 2118052849; // Replace with your App ID
    const serverSecret = "59d3476834a436035eccb100c5189daf"; // Replace with your Secret Key
    const userID = `viewer_${Math.floor(Math.random() * 1000)}`;
    const userName = `Viewer_${Math.floor(Math.random() * 1000)}`;

    // Generate Kit Token
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID,
        userName
    );

    // Create Zego UIKit Instance
    const zp = ZegoUIKitPrebuilt.create(kitToken);

    // Join Room as Audience (Only Viewing, No Video Sharing)
    zp.joinRoom({
        container: document.getElementById('zego-viewer-container') as HTMLElement,
        scenario: {
            mode: ZegoUIKitPrebuilt.LiveStreaming,
            config: {
                role: ZegoUIKitPrebuilt.Audience, // Viewer Role (Can only watch)
            },
        },
    });

    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Live Cooking Video</h3>

                <div id="zego-viewer-container" className="w-full h-96 bg-black rounded-lg"></div>

                <button
                    onClick={onClose}
                    className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
