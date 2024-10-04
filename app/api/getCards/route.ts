// import { NextResponse } from 'next/server'
// import { api } from '../../../lib/sdkClient'
// import { GetPlayerCardsDTOOrderByEnum } from '@fantasy-top/sdk-pro'

// export async function POST(request: Request) {
// 	const { playerId } = await request.json()

// 	try {
// 		const result = await api.card.getCardsByPlayerId({
// 			playerId,
// 			query: {
// 				groupCard: true,
// 				pagination: {
// 					page: 0,
// 					limit: 10000,
// 				},
// 				orderBy: GetPlayerCardsDTOOrderByEnum.Score,
// 				where: {
// 					rarity: {
// 						in: [1, 2, 3, 4],
// 					},
// 				},
// 			},
// 		})

// 		return NextResponse.json(result.data)
// 	} catch (error) {
// 		console.error('Error fetching cards:', error)
// 		return NextResponse.json({ message: 'Error fetching cards' }, { status: 500 })
// 	}
// }