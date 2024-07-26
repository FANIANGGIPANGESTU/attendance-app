import React, { useEffect, useState } from 'react';
import supabase from './connector';

const App = () => {
  const [attData, setAttData] = useState([]);
  ///fariabel update menggunakan usestate
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentData, setCurrentData] = useState({ email: '', fullname: '', phone: '', address: '' });

  function handleSubmit(event) {
    event.preventDefault();
            //////fariabel data
    const fullname = event.target.fullname.value;
    const email = event.target.email.value;
    const phone = event.target.phone.value;
    const address = event.target.address.value;

    if (!fullname || !email || !phone || !address) return alert('Silahkan masukan data');

    if (isUpdating) {
      supabase
        .from('attendance')
        .update({ fullname, phone, address })
        .eq('email', email)
        .then((res) => {
          console.info(res);
          window.location.reload();
        });
    } else {
      supabase
        .from('attendance')
        .insert([{ fullname, email, phone, address }])
        .then((res) => {
          console.info(res);
          window.location.reload();
        });
    }
  }
           //////dleleted satu satu
  function handleDelete(email) {
    const conf = window.confirm('Yakin delete data ini?');
    if (!conf) return;

    supabase
      .from('attendance')
      .delete()
      .eq('email', email)
      .then((res) => {
        window.location.reload();
      });
  }
           //////deleted All
  function handleDeleteAll() {
    const conf = window.confirm('Yakin delete semua data?');
    if (!conf) return;

    supabase
      .from('attendance')
      .delete()
      .gt('email', '') // Menghapus semua baris dengan email yang tidak kosong karna saya tidk memakai id
      .then((res) => {
        console.info(res);
        window.location.reload();
      });
  }
        //////////updatae 
  function handleUpdate(data) {
    setIsUpdating(true);
    setCurrentData(data);
  }

  useEffect(() => {
    supabase
      .from('attendance')
      .select()
      .then((res) => {
        setAttData(res.data);
      });
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-700">Attendance App</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded p-6">
        <div>
          <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Fullname</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            maxLength="100"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            defaultValue={currentData.fullname}
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            defaultValue={currentData.email}
            readOnly={isUpdating}
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            id="phone"
            name="phone"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            defaultValue={currentData.phone}
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            className="mt-1 p-2 block w-full border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            defaultValue={currentData.address}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">
          {isUpdating ? 'Update' : 'Submit'}
        </button>
      </form>

      <div className="overflow-x-auto mt-8">
        <table className="min-w-full border-collapse border border-gray-200 bg-white shadow-md rounded-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 p-2">Email</th>
              <th className="border border-gray-200 p-2">Fullname</th>
              <th className="border border-gray-200 p-2">Phone</th>
              <th className="border border-gray-200 p-2">Address</th>
              <th className="border border-gray-200 p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {attData.map((e) => (
              <tr key={e.email} className="hover:bg-gray-100">
                <td className="border border-gray-200 p-2">{e.email}</td>
                <td className="border border-gray-200 p-2">{e.fullname}</td>
                <td className="border border-gray-200 p-2">{e.phone}</td>
                <td className="border border-gray-200 p-2">{e.address}</td>
                <td className="border border-gray-200 p-2 flex flex-col sm:flex-row gap-2 justify-center">
                  <button onClick={() => handleDelete(e.email)} className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600">Delete</button>
                  <button onClick={() => handleUpdate(e)} className="bg-green-500 text-white py-1 px-2 rounded-md hover:bg-green-600">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleDeleteAll} className="bg-red-600 text-white py-2 px-4 mt-4 rounded-md hover:bg-red-700">Delete All</button>
    </div>
  );
};

export default App;
