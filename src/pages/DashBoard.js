import React from 'react'
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';

import { Doughnut } from 'react-chartjs-2';
import { DashboardTile } from '../components/dashboard';


const DashBoard = () => {
    return (
        <div className="flex">
            <div className="bg-[#3f3f3f] h-[100vh] w-[20vw] py-10 px-20 text-lg text-[#b5b5b5]">
                <ul>
                    <li className="my-4"><Link to="/">Home</Link></li>
                    <li className="my-4"><Link to="/dashboard">Dashboard</Link></li>
                    <li className="my-4"><Link to="/createStream">Stream</Link></li>
                    <li className="my-4">Video NFT</li>
                </ul>
            </div>
            <div className="p-[5vw]">
                <div className="flex w-[65vw] max-w-[1500px] justify-between items-center">
                    <div className="w-[500px]">
                        <Doughnut data={data} options={options} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-medium my-12 mx-16">Total Earned: 1000000</h1>
                        <h1 className="text-3xl font-medium my-12 mx-16">Views: 300000</h1>
                    </div>
                </div>
                <div>
                    <DashboardTile />
                </div>
            </div>
        </div>

    );
};

const data = {
    labels: [
        'Stream',
        'Tips',
    ],
    datasets: [{
        label: 'My First Dataset',
        data: [10000, 21000],
        backgroundColor: [
            'rgb(63, 63, 63)',
            // 'rgb(181, 181, 181)',
            'rgb(211, 211, 211)'
        ],
        hoverOffset: 4
    }]
};
const options = {
    plugins: {
        legend: {
            display: true,
            position: 'bottom'
        },
        layout: {
            padding: 20
        }
    }
};

export default DashBoard;