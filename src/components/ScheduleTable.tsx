import React from 'react';
import { Play } from 'lucide-react';

const ScheduleTable = () => {
  const scheduleData = [
    { time: '09:00', student: 'Ana Silva', instructor: 'Carla Mendes' },
    { time: '10:00', student: 'Maria Santos', instructor: 'Sarah Costa' },
    { time: '11:00', student: 'João Pedro', instructor: 'Carla Mendes' },
    { time: '14:00', student: 'Lucia Fernandes', instructor: 'Sarah Costa' },
    { time: '15:00', student: 'Patricia Lima', instructor: 'Carla Mendes' },
  ];

  return (
    <section className="bg-white rounded-3xl shadow-3d p-8 mb-10">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Próximas Aulas</h2>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-500/10 rounded-xl">
              <th className="text-left p-4 font-semibold text-gray-700">Horário</th>
              <th className="text-left p-4 font-semibold text-gray-700">Aluno</th>
              <th className="text-left p-4 font-semibold text-gray-700">Instrutor</th>
              <th className="text-left p-4 font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {scheduleData.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 hover:scale-[1.01] hover:shadow-md"
              >
                <td className="p-4 font-medium text-gray-900">{item.time}</td>
                <td className="p-4 text-gray-700">{item.student}</td>
                <td className="p-4 text-gray-700">{item.instructor}</td>
                <td className="p-4">
                  <button className="bg-primary-gradient text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300 hover:shadow-neon hover:-translate-y-1">
                    <Play className="w-4 h-4" />
                    Iniciar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ScheduleTable;