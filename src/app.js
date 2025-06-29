import React, { useState, useMemo, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Home, List, PlusCircle, Settings, Search, Trash2, Edit, Save, X, ArrowLeft, CheckCircle, Loader, AlertCircle } from 'lucide-react';

// --- Helper Components ---
const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-full py-10">
        <Loader className="w-12 h-12 text-indigo-600 animate-spin" />
    </div>
);

const ErrorMessage = ({ message }) => (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center" role="alert">
        <AlertCircle className="w-6 h-6 mr-3" />
        <p>{message}</p>
    </div>
);


// --- Main Components ---

const Sidebar = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'quizzes', icon: List, label: 'Quizzes' },
    { id: 'create', icon: PlusCircle, label: 'Create New' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-6 flex items-center space-x-3">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
        </div>
        <h1 className="text-2xl font-bold">QuizNova</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map(item => (
          <a
            key={item.id}
            href="#"
            onClick={(e) => { e.preventDefault(); setActivePage(item.id); }}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${activePage === item.id ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.label}</span>
          </a>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center">
          <img className="h-10 w-10 rounded-full object-cover" src="https://placehold.co/100x100/7e22ce/ffffff?text=A" alt="Admin" />
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-gray-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ title, onActionClick }) => (
  <header className="bg-white shadow-sm p-6 flex justify-between items-center">
    <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
    <div className="flex items-center space-x-4">
      <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700">
        <Search className="w-6 h-6" />
      </button>
      <button onClick={onActionClick} className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-indigo-700 transition-colors">
        <PlusCircle className="w-5 h-5" />
        <span>Create Quiz</span>
      </button>
    </div>
  </header>
);

const StatCard = ({ icon, title, value, change, changeType }) => {
  const IconComponent = icon;
  const changeColor = changeType === 'increase' ? 'text-green-500' : 'text-red-500';
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-6">
      <div className="bg-indigo-100 p-4 rounded-lg">
        <IconComponent className="w-8 h-8 text-indigo-600" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {change && (
          <p className={`text-sm ${changeColor}`}>
            {change} vs last month
          </p>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ quizzes }) => {
    const chartData = quizzes.map(q => ({
        name: q.title.length > 15 ? q.title.substring(0, 12) + '...' : q.title,
        Plays: q.plays || 0,
        Questions: q.questions || 0,
    }));

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={List} title="Total Quizzes" value={quizzes.length} />
          <StatCard icon={CheckCircle} title="Total Submissions" value="1,287" change="+15%" changeType="increase" />
          <StatCard icon={Home} title="Active Quizzes" value={quizzes.filter(q => q.status === 'Published').length} />
          <StatCard icon={Settings} title="Drafts" value={quizzes.filter(q => q.status === 'Draft').length} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Quiz Performance</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                <YAxis tick={{ fill: '#6B7280' }} />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(5px)', borderRadius: '0.5rem', border: '1px solid #E5E7EB' }} />
                <Legend />
                <Bar dataKey="Plays" fill="#818CF8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Questions" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
};

const QuizList = ({ quizzes, setQuizzes, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredQuizzes = useMemo(() => 
    quizzes.filter(quiz => 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
    ), [quizzes, searchTerm]);

  const getStatusChip = (status) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search quizzes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 text-sm text-gray-500">
              <th className="p-4">Quiz Title</th>
              <th className="p-4">Questions</th>
              <th className="p-4">Plays</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Modified</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuizzes.map(quiz => (
              <tr key={quiz.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4 font-medium text-gray-800">{quiz.title}</td>
                <td className="p-4 text-gray-600">{quiz.questions}</td>
                <td className="p-4 text-gray-600">{quiz.plays || 'N/A'}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusChip(quiz.status)}`}>
                    {quiz.status}
                  </span>
                </td>
                <td className="p-4 text-gray-600">{quiz.date}</td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <button onClick={() => onEdit(quiz)} className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-100 rounded-full transition">
                      <Edit className="w-5 h-5" />
                    </button>
                    <button onClick={() => onDelete(quiz.id)} className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 rounded-full transition">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const QuizForm = ({ activeQuiz, onSave, onCancel }) => {
  const [step, setStep] = useState(1);
  const [quizDetails, setQuizDetails] = useState(
    activeQuiz || { title: '', description: '', status: 'Draft' }
  );
  const [questions, setQuestions] = useState(
    activeQuiz?.questionsData || [
      { id: 1, text: '', type: 'multiple-choice', options: ['', '', '', ''], correct: 0 },
    ]
  );

  const handleDetailChange = (e) => {
    const { name, value } = e.target;
    setQuizDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (qId, field, value) => {
    setQuestions(prev => prev.map(q => q.id === qId ? { ...q, [field]: value } : q));
  };

  const handleOptionChange = (qId, oIndex, value) => {
    setQuestions(prev => prev.map(q => 
      q.id === qId 
        ? { ...q, options: q.options.map((opt, i) => i === oIndex ? value : opt) } 
        : q
    ));
  };
  
  const addQuestion = () => {
    const newId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;
    setQuestions(prev => [...prev, { id: newId, text: '', type: 'multiple-choice', options: ['', '', '', ''], correct: 0 }]);
  };

  const removeQuestion = (qId) => {
    if (questions.length > 1) {
      setQuestions(prev => prev.filter(q => q.id !== qId));
    }
  };

  const handleSave = () => {
    const quizData = {
        ...quizDetails,
        id: activeQuiz?.id,
        questionsData: questions,
    };
    onSave(quizData);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">{activeQuiz ? 'Edit Quiz' : 'Create a New Quiz'}</h2>
          <p className="text-gray-500 mt-1">Fill in the details below to set up your quiz.</p>
        </div>
         <button onClick={onCancel} className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-full">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex items-center justify-center mb-8 space-x-4">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <p className={`ml-2 font-medium ${step >= 1 ? 'text-indigo-600' : 'text-gray-500'}`}>Quiz Details</p>
        </div>
        <div className="flex-1 h-0.5 bg-gray-200"></div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
          <p className={`ml-2 font-medium ${step >= 2 ? 'text-indigo-600' : 'text-gray-500'}`}>Add Questions</p>
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-fade-in">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Quiz Title</label>
            <input type="text" name="title" id="title" value={quizDetails.title} onChange={handleDetailChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea name="description" id="description" rows="4" value={quizDetails.description} onChange={handleDetailChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>
          <div className="flex justify-end">
            <button onClick={() => setStep(2)} className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition">Next: Add Questions</button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          {questions.map((q, index) => (
            <div key={q.id} className="p-6 border border-gray-200 rounded-lg bg-gray-50 relative">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg text-gray-700">Question {index + 1}</h4>
                <button onClick={() => removeQuestion(q.id)} className="p-1 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <textarea placeholder="Enter your question here..." value={q.text} onChange={(e) => handleQuestionChange(q.id, 'text', e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg mb-4"></textarea>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {q.options.map((opt, oIndex) => (
                  <div key={oIndex} className="flex items-center space-x-2">
                    <input type="radio" name={`correct_answer_${q.id}`} checked={q.correct === oIndex} onChange={() => handleQuestionChange(q.id, 'correct', oIndex)} className="form-radio h-5 w-5 text-indigo-600" />
                    <input type="text" placeholder={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(q.id, oIndex, e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          ))}
          <button onClick={addQuestion} className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition">+ Add Another Question</button>
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button onClick={() => setStep(1)} className="text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-100 transition flex items-center"><ArrowLeft className="w-4 h-4 mr-2" /> Back</button>
            <button onClick={handleSave} className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition flex items-center space-x-2"><Save className="w-5 h-5" /><span>Save Quiz</span></button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [quizzes, setQuizzes] = useState([]);
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API details from WordPress
  const API_URL = window.quiznovaData?.apiUrl || '/wp-json/quiznova/v1/';
  const NONCE = window.quiznovaData?.nonce || '';

  const fetchQuizzes = () => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}quizzes`, {
        headers: { 'X-WP-Nonce': NONCE }
    })
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok.');
        return response.json();
    })
    .then(data => {
        setQuizzes(data);
        setLoading(false);
    })
    .catch(err => {
        setError('Failed to load quizzes. Please check your connection or API endpoint.');
        setLoading(false);
        console.error("Fetch error:", err);
    });
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleSaveQuiz = (quizData) => {
    const isUpdating = !!quizData.id;
    const url = isUpdating ? `${API_URL}quizzes/${quizData.id}` : `${API_URL}quizzes`;
    
    fetch(url, {
        method: 'POST', // WP REST API uses POST for both creating and updating via EDITABLE method
        headers: {
            'Content-Type': 'application/json',
            'X-WP-Nonce': NONCE,
        },
        body: JSON.stringify(quizData),
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to save the quiz.');
        return response.json();
    })
    .then(() => {
        setActiveQuiz(null);
        setActivePage('quizzes');
        fetchQuizzes(); // Refetch all quizzes to show the latest data
    })
    .catch(err => {
        setError('Could not save quiz. Please try again.');
        console.error("Save error:", err);
    });
  };

  const handleDeleteQuiz = (id) => {
      if (!window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
          return;
      }
      fetch(`${API_URL}quizzes/${id}`, {
          method: 'DELETE',
          headers: { 'X-WP-Nonce': NONCE }
      })
      .then(response => {
          if (!response.ok) throw new Error('Failed to delete the quiz.');
          return response.json();
      })
      .then(() => {
          fetchQuizzes(); // Refetch quizzes after deletion
      })
      .catch(err => {
          setError('Could not delete quiz. Please try again.');
          console.error("Delete error:", err);
      });
  };

  const handleEditQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setActivePage('create');
  };

  const handleCreateNew = () => {
    setActiveQuiz(null);
    setActivePage('create');
  }

  const handleCancelForm = () => {
    setActiveQuiz(null);
    setActivePage('quizzes');
  };

  const renderContent = () => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    if (activePage === 'create' || activeQuiz) {
      return <QuizForm activeQuiz={activeQuiz} onSave={handleSaveQuiz} onCancel={handleCancelForm} />;
    }
    switch (activePage) {
      case 'dashboard':
        return <Dashboard quizzes={quizzes} />;
      case 'quizzes':
        return <QuizList quizzes={quizzes} setQuizzes={setQuizzes} onEdit={handleEditQuiz} onDelete={handleDeleteQuiz} />;
      case 'settings':
        return <div className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-xl font-bold">Settings</h3><p>Settings page coming soon...</p></div>;
      default:
        return <Dashboard quizzes={quizzes} />;
    }
  };
  
  const getPageTitle = () => {
    if (activePage === 'create' || activeQuiz) return activeQuiz ? 'Edit Quiz' : 'Create Quiz';
    switch (activePage) {
      case 'dashboard': return 'Dashboard';
      case 'quizzes': return 'Your Quizzes';
      case 'settings': return 'Settings';
      default: return 'Dashboard';
    }
  };

  return (
    <div className="flex bg-gray-100 font-sans">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1">
        <Header title={getPageTitle()} onActionClick={handleCreateNew} />
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
