import Image from 'next/image'
import Link from 'next/link'
import { UserCircleIcon } from '@heroicons/react/24/outline'

export default function ProfileCard({ id, handle, name, stats, picture }) {
    return (
        <Link href={`/profile/${id}`} key={id}>
            <a className="flex flex-col items-center">
                {picture &&
                picture.original &&
                picture.original.url.includes('lens.infura-ipfs.io') ? (
                    <div className="relative w-56 h-56 bg-emerald-900 rounded">
                        <Image
                            src={picture.original.url}
                            layout="fill"
                            objectFit="cover"
                            alt={handle}
                            className="rounded"
                        />
                    </div>
                ) : (
                    <div className="bg-emerald-900 w-60 h-60 rounded">
                        <UserCircleIcon className="h-52 w-52 text-gray-900 dark:text-gray-300 m-4" />
                    </div>
                )}
                <div className="mt-4 text-lg leading-6 font-medium text-center space-y-1">
                    {name ? <h3>{name}</h3> : <h3>no_name</h3>}
                    <p className="text-emerald-600">{handle}</p>
                </div>
                <div className="text-gray-600 mt-2 grid grid-cols-2 gap-x-2 text-sm sm:text-base text-center">
                    <p>
                        <span className="text-gray-900 dark:text-gray-300 font-medium">
                            {stats.totalFollowers}
                        </span>{' '}
                        Followers
                    </p>
                    <p>
                        <span className="text-gray-900 dark:text-gray-300 font-medium">
                            {stats.totalFollowing}
                        </span>{' '}
                        Following
                    </p>
                </div>
            </a>
        </Link>
    )
}
