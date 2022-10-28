import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@apollo/client'
import { useSubscriptions } from '../hooks/useSubscriptions'

// Icons
import { BiUser, BiCrown, BiExit } from 'react-icons/bi'

// Queries, Mutations and Subscriptions
import { LEAVE_ROOM } from '../graphql/mutations'
import { ROOM_USER_JOINED, ROOM_USER_LEFT, ROOMS_UPDATED } from '../graphql/subscriptions'
import { GET_ROOM, LIST_ROOMS } from '../graphql/queries'
import { includedIn, includedIn2 } from '../utils'
import TopBar from './TopBar'
import ButtonRoom from './ButtonRoom'

const Room = () => {
    const navigate = useNavigate()
    const user = localStorage.getItem('user')
    const { id } = useParams()

    // Queries, Mutations and Subscriptions
    useSubscriptions(ROOM_USER_JOINED, GET_ROOM, 'roomUserJoined', 'getRoom', includedIn)
    useSubscriptions(ROOM_USER_LEFT, GET_ROOM, 'roomUserLeft', 'getRoom', includedIn)
    useSubscriptions(ROOMS_UPDATED, LIST_ROOMS, 'roomsUpdated', 'listRooms', includedIn2)
    const { loading, error, data } = useQuery(GET_ROOM, { variables: { id: id } })
    const [leaveRoom] = useMutation(LEAVE_ROOM);
    const { leader, users, isOpen } = data?.getRoom || {}

    // Handlers
    const handleSubmit = async (e) => {
        e.preventDefault()
        await leaveRoom({ variables: { id: id, user: user } })
        navigate('/rooms')
    }

    if (loading) return 'Loading...'
    if (error) return `Error! ${error.message}`

    return (
        <>
            <TopBar
                user={user}
            >
                <ButtonRoom
                    value={<BiExit/>}
                    handleSubmit={handleSubmit}
                />
            </TopBar>

            <div className='flex flex-row justify-between p-4 items-center'>
                {leader === user
                    ? <button className='btn btn-dark-gray'>{(isOpen) ? 'Close' : 'Open'}</button>
                    : <div />
                }
                <h1 className='text-4xl text-center'>Room</h1>
                {leader === user
                    ? <button className='btn btn-dark-gray'> Start</button>
                    : <div />
                }
            </div>

            <div className="container">
                <div className='container-users'>
                    {users.map((user) =>
                        <div key={user} className="w-1/3 lg:w-1/5 md:w-1/4 p-2">
                            <div className={`flex flex-row rounded-xl align-middle items-center p-2 overflow-hidden text-ellipsis whitespace-nowrap ${(leader === user) ? 'bg-color-yellow' : 'bg-white'} bg-opacity-90 text-center`}>
                                <div className='text-2xl text-black'>
                                    {(leader === user) ? <BiCrown /> : <BiUser />}
                                </div>
                                <span className='flex-auto text-gray-900 text-xl'>
                                    {user}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className='absolute flex flex-row bottom-2 right-2 text-gray-200 text-2xl items-center px-2 rounded-full'>
                <BiUser /> 1000
            </div>
        </>
    );
}

export default Room;