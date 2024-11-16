"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import YumertsCanvas from "@/components/canvas";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { User, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Spinner } from "@nextui-org/react";

interface Message {
  content: string;
  // Add other properties your message object has
}

const messages = [
  { 
    id: 1,
    timestamp: '2023-04-15T12:34:56',
    sender: 'John Doe',
    content: 'This is the latest message.'
  },
  {
    id: 2, 
    timestamp: '2023-04-14T10:20:30',
    sender: 'Jane Smith',
    content: 'Here is a previous message.'
  },
  {
    id: 3,
    timestamp: '2023-04-13T08:15:00', 
    sender: 'Bob Johnson',
    content: 'This is an older message.'
  },
  {
    id: 4,
    timestamp: '2023-04-12T16:45:00',
    sender: 'Alice Williams',
    content: 'Here is another older message.'
  },
  {
    id: 5,
    timestamp: '2023-04-11T14:30:00',
    sender: 'Tom Davis',
    content: 'This is the oldest message.'
  }
];

const MessageCard = ({ message }: { message: Message }) => (
  <Card className="mb-1">
    <CardBody className="text-sm">
      <p>{message.content}</p>
    </CardBody>
  </Card>
);

const MessageList = () => (
  <div className="bg-gray-100 p-4 rounded-lg overflow-y-auto h-[300px]">
    {messages.map(message => (
      <MessageCard key={message.id} message={message} />
    ))}
  </div>
);

const LatestMessageList = () => (
  <div className="bg-gray-100 p-4 rounded-lg overflow-y-auto h-[300px]">
    {messages.slice(0, 3).map(message => (
      <MessageCard key={message.id} message={message} />
    ))}
  </div>
);

export default function GamePage() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isSearching, setIsSearching] = useState(true);
  interface Opponent {
    username: string;
    avatar: string;
    level: number;
  }
  
  const [opponent, setOpponent] = useState<Opponent | null>(null);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const params = useParams<{ slug: string }>();
  const match_id = params.slug;
  console.log(match_id);

  useEffect(() => {
    // Simulate finding an opponent after 3 seconds
    const timer = setTimeout(() => {
      setIsSearching(false);
      setOpponent({
        username: "OpponentUser",
        avatar: "https://i.pravatar.cc/150?u=opponent",
        level: 25
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputReceived = (input: { troopId: string; targetCoordinate: { x: number; y: number } }) => {
    if (!socket) return;
    try {
      socket.send(JSON.stringify(input));
    } catch (err) {
      setError('Failed to send command. Please try again.');
    }
  };

  const handleAccept = () => {
    setHasAccepted(true);
    setOpponent(null);
    // Here you would typically start the game or perform any other necessary actions
  };

  return (
    <>
      <div className={`flex h-screen ${!hasAccepted ? 'filter blur-sm' : ''}`}>
        <div className="w-3/4 bg-gray-100 p-8">
          <div className="App">
            <YumertsCanvas inputReceived={handleInputReceived} />
          </div>
        </div>
        <div className="w-1/4 bg-white p-8 flex flex-col space-y-4 h-full">
          <LatestMessageList />
          <MessageList />
        </div>
      </div>

      <Modal isOpen={isSearching} hideCloseButton isDismissable={false} >
        <ModalContent>
          <ModalBody>
            <div className="flex flex-col items-center">
              <Spinner color="secondary" size="lg" />
              <p className="mt-4">Finding player...</p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={!isSearching && opponent !== null && !hasAccepted} onClose={() => setOpponent(null)}>
        <ModalContent>
          <ModalHeader>
            <h4>Opponent Found</h4>
          </ModalHeader>
          <ModalBody>
            {opponent && (
              <div className="flex items-center space-x-4">
                <User
                  name={opponent.username}
                  avatarProps={{
                    src: opponent.avatar
                  }}
                />
                <p>Level: {opponent.level}</p>
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button auto onPress={handleAccept} color="primary">
              Accept
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {error && (
        <Modal isOpen={!!error} onClose={() => setError(null)}>
          <ModalContent>
            <ModalHeader>Error</ModalHeader>
            <ModalBody>{error}</ModalBody>
            <ModalFooter>
              <Button auto onPress={() => setError(null)}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}