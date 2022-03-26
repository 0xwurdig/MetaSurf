import { collection, getDocs, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase';

export const DashboardTile = () => {
  const [data, setData] = useState([]);

  const getData = async () => {
    const q = query(collection(db, "videos"));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        let data = doc.data();
        data["id"] = doc.id
        setData(state => [...state, data])
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
                <th className="text-left text-xl font-medium">Thumbnail</th>
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
                      alt={row.name}
                      src={row.thumbNail}
                      className='rounded-1xl w-1/4 h-6 mb-2 place-content-center'
                    />
                  </td>
                  <td>{row.id}</td>
                  <td>{row.views || 2}</td>
                  <td>{row.tips}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    )
}