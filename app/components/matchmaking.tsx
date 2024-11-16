import React, { useState } from 'react';
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Input } from "@nextui-org/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";
import { LogOut, Eye, Play, FastForward, Plus } from 'lucide-react';

// Sample data for matches
const sampleMatches = {
  startingSoon: [
    { id: 1, playerA: "Alice", playerB: "Bob", startTime: "10:00 AM" },
    { id: 2, playerA: "Charlie", playerB: "David", startTime: "10:30 AM" },
  ],
  ongoing: [
    { id: 3, playerA: "Eve", playerB: "Frank", duration: "15:20" },
    { id: 4, playerA: "Grace", playerB: "Henry", duration: "08:45" },
  ],
  past: [
    { id: 5, playerA: "Ivy", playerB: "Jack", result: "Ivy won" },
    { id: 6, playerA: "Kate", playerB: "Liam", result: "Draw" },
  ]
};

// Sample user data
const user = {
  name: "John Doe",
  avatar: "/placeholder.svg?height=40&width=40",
  level: 42
};

export const MatchLobbies = () => {
  const [matches, setMatches] = useState(sampleMatches);
  const [selectedPrediction, setSelectedPrediction] = useState<string | null>(null);
  const [betAmount, setBetAmount] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSpectate = (matchId: number) => {
    console.log(`Spectating match ${matchId}`);
    // Add your spectate logic here
  };

  const handlePredict = (player: string) => {
    setSelectedPrediction(player);
  };

  const handleBetAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBetAmount(e.target.value);
  };

  const handleConfirmBet = () => {
    if (selectedPrediction && betAmount) {
      console.log(`Bet confirmed: ${betAmount} on ${selectedPrediction}`);
      // Add your bet confirmation logic here
      setIsDialogOpen(false);
      setSelectedPrediction(null);
      setBetAmount('');
    }
  };

  const handleReplay = (matchId: number) => {
    console.log(`Replaying match ${matchId}`);
    // Add your replay logic here
  };

  const handleLogout = () => {
    console.log("Logging out");
    // Add your logout logic here
  };

  const handleCreateMatch = () => {
    console.log("Creating a new match");
    // Add your create match logic here
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Match Making Lobbies</h1>
        <div className="flex items-center space-x-4">
          <Card className="w-auto">
            <CardBody className="flex items-center space-x-4 p-2">
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">Level {user.level}</p>
              </div>
            </CardBody>
          </Card>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>
      <Button className="mb-6" onClick={handleCreateMatch}>
        <Plus className="mr-2 h-4 w-4" />
        Create Match
      </Button>
      <main className="grid gap-6 md:grid-cols-3">
        <section>
          <h2 className="text-xl font-semibold mb-4">Starting Soon</h2>
          {matches.startingSoon.map((match) => (
            <Card key={match.id} className="mb-4">
              <CardHeader>
                {match.playerA} vs {match.playerB}
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-500">Starts at: {match.startTime}</p>
              </CardBody>
              <CardFooter>
              <Modal isOpen={isDialogOpen} onOpenChange={setIsDialogOpen}>
  <ModalContent className="sm:max-w-[425px]">
    {(onClose) => (
      <>
        <ModalHeader>
          <p>Predict the Winner</p>
        </ModalHeader>
        <ModalBody>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => handlePredict(match.playerA)}
                variant={selectedPrediction === match.playerA ? "solid" : "bordered"}
              >
                {match.playerA}
              </Button>
              <Button
                onClick={() => handlePredict(match.playerB)}
                variant={selectedPrediction === match.playerB ? "solid" : "bordered"}
              >
                {match.playerB}
              </Button>
            </div>
            <div className="grid gap-2">
              <p>Bet Amount</p>
              <Input
                id="betAmount"
                type="number"
                placeholder="Enter bet amount"
                value={betAmount}
                onChange={handleBetAmountChange}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button 
            onClick={handleConfirmBet} 
            isDisabled={!selectedPrediction || !betAmount}
          >
            Confirm Bet
          </Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
</Modal>

{/* Trigger button outside the modal */}
<Button onClick={() => setIsDialogOpen(true)}>
  <FastForward className="mr-2 h-4 w-4" />
  Predict
</Button>
              </CardFooter>
            </Card>
          ))}
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Matchmaking Ongoing</h2>
          {matches.ongoing.map((match) => (
            <Card key={match.id} className="mb-4">
              <CardHeader>
                {match.playerA} vs {match.playerB}
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-500">Duration: {match.duration}</p>
              </CardBody>
              <CardFooter>
                <Button onClick={() => handleSpectate(match.id)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Spectate
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-4">Past Matches</h2>
          {matches.past.map((match) => (
            <Card key={match.id} className="mb-4">
              <CardHeader>
                {match.playerA} vs {match.playerB}
              </CardHeader>
              <CardBody>
                <p className="text-sm text-gray-500">Result: {match.result}</p>
              </CardBody>
              <CardFooter>
                <Button onClick={() => handleReplay(match.id)}>
                  <Play className="mr-2 h-4 w-4" />
                  Replay
                </Button>
              </CardFooter>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
};

export default MatchLobbies;