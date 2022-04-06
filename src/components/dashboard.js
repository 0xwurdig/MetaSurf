import { collection, getDocs, query, where, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { useWeb3React } from '@web3-react/core'

export const DashboardTile = () => {
  const [data, setData] = useState([]);
  const { account } = useWeb3React();

  const getData = async () => {
    const q = query(collection(db, "videos"), where("owner", "==", account));
    onSnapshot(q, (querySnapshot) => {
      const videos = [];
      querySnapshot.forEach((doc) => {
        videos.push(doc.data());
      });
      setData(videos);
    });
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="mt-10 drop-shadow-xl bg-white">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="text-left text-xl font-medium">Video</th>
            <th className="text-left text-xl font-medium">Title</th>
            <th className="text-left text-xl font-medium">ID</th>
            <th className="text-left text-xl font-medium">Views</th>
            <th className="text-left text-xl font-medium">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-[#3f3f3f] hover:text-white border-solid border-y-2 border-grey-100">
              <td>
                <img
                  alt=""
                  src={row.thumbnail}
                  className='rounded-1xl w-1/4 h-6 mb-2 place-content-center'
                />
              </td>
              <td>{row.title}</td>
              <td>{row.tokenId}</td>
              <td>{row.views.length}</td>
              <td>{row.tips}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}