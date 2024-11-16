"use client";

import { Card, CardBody, CardHeader, User } from "@nextui-org/react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { createPublicClient, encodeFunctionData, erc20Abi, http } from "viem";
import { arbitrumSepolia } from "viem/chains";
import { useEffect, useState } from "react";

const publicClient = createPublicClient({
  chain: arbitrumSepolia,
  transport: http(),
});

// Sample user data
const userData = {
  username: "GamerPro123",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  gamesWon: 42,
  gamesLost: 18,
  stats: [
    { stat: "Attack", value: 80 },
    { stat: "Defense", value: 65 },
    { stat: "Speed", value: 90 },
    { stat: "Strategy", value: 75 },
    { stat: "Teamwork", value: 85 },
  ],
};

export default function ProfilePage() {
  const { ready, authenticated, login, logout, sendTransaction } = usePrivy();
  const { ready: walletsReady, wallets } = useWallets();
  const router = useRouter();

  let [displayName, setDisplayName] = useState("");
  let [gamesWon, setGamesWon] = useState(999);
  let [gamesLost, setGamesLost] = useState(999);

  useEffect(() => {
    const getPlayerInfo = async () => {
      let current_wallet = wallets[0];
      current_wallet.switchChain(421614);
      const provider = await current_wallet.getEthersProvider();
      const signer = provider.getSigner();

      const PLAYER_INFO_CONTRACT_ADDRESS =
        "0xb0e5edd9d771d59e9efdd5b6e36e76942ed9fd7d";
      const PLAYER_INFO_CONTRACT_ABI = [
        {
          inputs: [
            { internalType: "address", name: "winner_address", type: "address" },
            { internalType: "address", name: "loser_address", type: "address" },
          ],
          name: "addMatchResults",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "player_address", type: "address" },
            { internalType: "bool", name: "was_won", type: "bool" },
          ],
          name: "addPredictionResults",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "getDisplayName",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "player_address", type: "address" },
          ],
          name: "getDisplayNameByAddress",
          outputs: [{ internalType: "string", name: "", type: "string" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getMatchmakingContract",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getPredictionContract",
          outputs: [{ internalType: "address", name: "", type: "address" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getTotalMatches",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "player_address", type: "address" },
          ],
          name: "getTotalMatchesByAddress",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getTotalPredictions",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "player_address", type: "address" },
          ],
          name: "getTotalPredictionsByAddress",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getWinningMatches",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "player_address", type: "address" },
          ],
          name: "getWinningMatchesByAddress",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getWinningPredictions",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            { internalType: "address", name: "player_address", type: "address" },
          ],
          name: "getWinningPredictionsByAddress",
          outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "init",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "registerPlayer",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "matchmaking_contract",
              type: "address",
            },
          ],
          name: "setMatchmakingContract",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "prediction_contract",
              type: "address",
            },
          ],
          name: "setPredictionContract",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            { internalType: "string", name: "display_name", type: "string" },
          ],
          name: "updateDisplayName",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ];

      let player_display_name = "";
      try {
        player_display_name = await publicClient.readContract({
          address: PLAYER_INFO_CONTRACT_ADDRESS,
          abi: PLAYER_INFO_CONTRACT_ABI,
          functionName: "getDisplayNameByAddress",
          args: [wallets[0].address],
        }) as string;
        setDisplayName(player_display_name);
      } catch (error) {
        const registerPlayerUserData = encodeFunctionData({
          abi: PLAYER_INFO_CONTRACT_ABI,
          functionName: "registerPlayer",
        })
        const registerPlayerRequest = {
          to: PLAYER_INFO_CONTRACT_ADDRESS,
          data: registerPlayerUserData
        }
        await signer.sendTransaction(registerPlayerRequest);
        
        player_display_name = await publicClient.readContract({
          address: PLAYER_INFO_CONTRACT_ADDRESS,
          abi: PLAYER_INFO_CONTRACT_ABI,
          functionName: "getDisplayNameByAddress",
          args: [wallets[0].address],
        }) as string;
        setDisplayName(displayName);
      }

      let games_won = 0;
      let games_lost = 0;
      try {
        games_won = await publicClient.readContract({
          address: PLAYER_INFO_CONTRACT_ADDRESS,
          abi: PLAYER_INFO_CONTRACT_ABI,
          functionName: "getWinningMatchesByAddress",
          args: [wallets[0].address],
        }) as number;
        setGamesWon(0);
      } catch (error) {
        setGamesWon(0);
      }

      try {
        games_lost = await publicClient.readContract({
          address: PLAYER_INFO_CONTRACT_ADDRESS,
          abi: PLAYER_INFO_CONTRACT_ABI,
          functionName: "getTotalMatchesByAddress",
          args: [wallets[0].address],
        }) as number - games_won;
        console.log("Games Lost: " + games_lost);
        setGamesLost(games_lost);
      } catch (error) {
        setGamesLost(games_lost);
      }
    }

    if(authenticated && walletsReady) {
      getPlayerInfo();
      console.log("not working?");
    }
  });

  return (
    <div>
      <Card className="max-w-[800px] mx-auto">
        <CardHeader className="flex gap-3">
          <User
            name={displayName}
            avatarProps={{
              src: userData.avatar,
            }}
          />
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>Profile Summary</p>
              <p>
                <span className="font-semibold">Games Won:</span>{" "}
                {gamesWon}
              </p>
              <p>
                <span className="font-semibold">Games Lost:</span>{" "}
                {gamesLost}
              </p>
            </div>
            <div>
              <p>Player Stats</p>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={userData.stats}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="stat" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Stats"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
