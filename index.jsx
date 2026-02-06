import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  BarChart2, 
  Menu, 
  X, 
  ThumbsUp, 
  MoreVertical, 
  Check, 
  Play, 
  Square, 
  Plus, 
  Users, 
  ArrowRight,
  Monitor,
  Smartphone,
  Star,
  Hash,
  Trash2,
  Archive,
  Heart,
  Activity,
  Shield
} from 'lucide-react';

// --- HPG Design System Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon: Icon }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  
  // Branding: Indigo (Primary) and Rose (Accent)
  const variants = {
    primary: "bg-indigo-900 hover:bg-indigo-800 text-white focus:ring-indigo-800 shadow-md",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-200 shadow-sm",
    ghost: "bg-transparent hover:bg-indigo-50 text-indigo-900",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 focus:ring-rose-200",
    outline: "bg-transparent border-2 border-indigo-900 text-indigo-900 hover:bg-indigo-50"
  };

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled}
    >
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'neutral' }) => {
  const styles = {
    neutral: "bg-slate-100 text-slate-600",
    success: "bg-rose-100 text-rose-700", // Using brand accent for notifications
    warning: "bg-amber-100 text-amber-700",
    brand: "bg-indigo-100 text-indigo-800"
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>
      {children}
    </span>
  );
};

// --- Main Application ---

export default function App() {
  // --- State ---
  const [view, setView] = useState('landing'); 
  const [role, setRole] = useState('participant'); 
  const [currentEventCode, setCurrentEventCode] = useState(null);
  
  // Mock Data tailored for Health Partners Group context
  const [events, setEvents] = useState({
    '2024': {
      code: '2024',
      title: 'HPG Quarterly Town Hall',
      created: new Date().toISOString(),
      questions: [
        { id: 1, text: "When will the new clinical training modules be available on the Academy?", author: "Dr. Evans", likes: 18, answered: false, created: Date.now() - 100000 },
        { id: 2, text: "Great to see the new mental health initiatives. Are these available for remote staff too?", author: "Sarah J.", likes: 12, answered: false, created: Date.now() },
        { id: 3, text: "Can you clarify the new OH referral process mentioned?", author: "Anonymous", likes: 5, answered: true, created: Date.now() - 200000 },
      ],
      activePoll: null,
      polls: [
        {
          id: 'p1',
          type: 'choice',
          question: "How would you rate your current wellbeing balance?",
          options: [
            { id: 'o1', text: "Thriving 🌟", votes: 42 },
            { id: 'o2', text: "Managing well 👍", votes: 35 },
            { id: 'o3', text: "Could use support 🤝", votes: 12 },
          ],
          totalVotes: 89,
          status: 'draft' 
        }
      ]
    }
  });

  // --- Actions ---

  const createEvent = (title) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const newEvent = {
      code,
      title: title || 'Untitled Session',
      created: new Date().toISOString(),
      questions: [],
      activePoll: null,
      polls: []
    };

    setEvents(prev => ({
      ...prev,
      [code]: newEvent
    }));
    
    // Direct navigation avoids stale state check
    setCurrentEventCode(code);
    setRole('host');
    setView('event');
  };

  const joinEvent = (code, userRole = 'participant') => {
    if (events[code]) {
      setCurrentEventCode(code);
      setRole(userRole);
      setView('event');
    } else {
      alert("Session not found. Try code '2024' for the Town Hall.");
    }
  };

  const handleLeave = () => {
    setView('landing');
    setCurrentEventCode(null);
  };

  const updateEventData = (code, updates) => {
    setEvents(prev => ({
      ...prev,
      [code]: { ...prev[code], ...updates }
    }));
  };

  const currentEvent = events[currentEventCode];

  if (view === 'landing') {
    return (
      <LandingPage 
        onCreate={createEvent} 
        onJoin={joinEvent} 
      />
    );
  }

  if (currentEvent) {
    return (
      <EventWorkspace 
        event={currentEvent} 
        role={role} 
        setRole={setRole}
        onLeave={handleLeave}
        onUpdate={(updates) => updateEventData(currentEventCode, updates)}
      />
    );
  }

  return null;
}

// --- Page: Landing (Rebranded) ---

const LandingPage = ({ onCreate, onJoin }) => {
  const [joinCode, setJoinCode] = useState('');
  const [createTitle, setCreateTitle] = useState('');
  const [mode, setMode] = useState('join');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Internal Tool Navbar */}
      <nav className="bg-indigo-900 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3 font-semibold text-xl tracking-tight text-white">
          <div className="bg-white text-indigo-900 p-1.5 rounded flex items-center justify-center">
            <Activity size={20} />
          </div>
          <span className="opacity-90">HPG</span> <span className="font-light opacity-75">| Live</span>
        </div>
        <div className="flex gap-6 text-sm font-medium text-indigo-100">
          <div className="w-px bg-indigo-700 h-5 my-auto"></div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-4xl mx-auto w-full">

        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight" style={{ fontFamily: 'arial' }}>
          Helping our people <br/>
          <span className="text-rose-500">be their best.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Welcome to <span className="font-semibold text-slate-700">HPG Live</span>. Join the conversation.
        </p>

        <div className="w-full max-w-md bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-2">
          {mode === 'join' ? (
            <div className="flex flex-col gap-3 p-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left pl-1">Join Meeting</label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Hash className="absolute left-3 top-3 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="Enter event code" 
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl font-medium text-lg focus:outline-none focus:ring-2 focus:ring-indigo-900 text-slate-800 placeholder-slate-400 border border-transparent focus:border-transparent transition-all"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && onJoin(joinCode)}
                  />
                </div>
                <button 
                  onClick={() => onJoin(joinCode)}
                  className="bg-indigo-900 hover:bg-indigo-800 text-white rounded-xl px-6 font-bold text-lg transition-colors flex items-center shadow-lg shadow-indigo-200"
                >
                  <ArrowRight size={24} />
                </button>
              </div>
              <div className="text-sm text-slate-400 mt-2 flex justify-between">
                <button onClick={() => setMode('create')} className="text-indigo-900 font-bold hover:underline">Host a session</button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-4">
               <label className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left pl-1">Host New Session</label>
              <input 
                type="text" 
                placeholder="Session Name (e.g. Clinical Update)" 
                className="w-full px-4 py-3 bg-slate-50 rounded-xl font-medium text-lg focus:outline-none focus:ring-2 focus:ring-indigo-900 border border-transparent"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onCreate(createTitle)}
              />
              <Button onClick={() => onCreate(createTitle)} className="w-full py-3 text-lg bg-indigo-900 hover:bg-indigo-800">
                Create Session
              </Button>
               <div className="text-sm text-slate-400 mt-2">
                <button onClick={() => setMode('join')} className="text-indigo-900 font-bold hover:underline">Back to join</button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-16 border-t border-slate-200 pt-8 w-full max-w-2xl flex justify-between items-center text-slate-400 text-sm">
           <span>© 2026 Health Partners Group</span>
        </div>
      </main>
    </div>
  );
};

// --- Page: Event Workspace ---

const EventWorkspace = ({ event, role, setRole, onLeave, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('qa');

  // --- Handlers ---
  const addQuestion = (text, author) => {
    const newQ = {
      id: Date.now(),
      text,
      author: author || 'Anonymous',
      likes: 0,
      answered: false,
      created: Date.now()
    };
    onUpdate({ questions: [newQ, ...event.questions] });
  };

  const toggleLike = (id) => {
    const updatedQs = event.questions.map(q => 
      q.id === id ? { ...q, likes: q.likes + 1 } : q
    );
    onUpdate({ questions: updatedQs });
  };

  const toggleAnswered = (id) => {
    const updatedQs = event.questions.map(q => 
      q.id === id ? { ...q, answered: !q.answered } : q
    );
    onUpdate({ questions: updatedQs });
  };

  const deleteQuestion = (id) => {
    const updatedQs = event.questions.filter(q => q.id !== id);
    onUpdate({ questions: updatedQs });
  };

  const createPoll = (pollData) => {
    const newPoll = { ...pollData, id: `p${Date.now()}`, status: 'draft', totalVotes: 0 };
    onUpdate({ polls: [...event.polls, newPoll] });
  };

  const activatePoll = (pollId) => {
    const updatedPolls = event.polls.map(p => ({
      ...p,
      status: p.id === pollId ? 'active' : (p.status === 'active' ? 'ended' : p.status)
    }));
    onUpdate({ 
      polls: updatedPolls,
      activePoll: updatedPolls.find(p => p.id === pollId)
    });
  };

  const stopPoll = () => {
    const updatedPolls = event.polls.map(p => ({
      ...p,
      status: p.status === 'active' ? 'ended' : p.status
    }));
    onUpdate({ polls: updatedPolls, activePoll: null });
  };

  const votePoll = (pollId, optionId) => {
    const pollIndex = event.polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) return;

    const poll = event.polls[pollIndex];
    const updatedOptions = poll.options.map(o => 
      o.id === optionId ? { ...o, votes: o.votes + 1 } : o
    );
    
    const updatedPoll = { 
      ...poll, 
      options: updatedOptions, 
      totalVotes: poll.totalVotes + 1 
    };

    const newPolls = [...event.polls];
    newPolls[pollIndex] = updatedPoll;

    onUpdate({ 
      polls: newPolls, 
      activePoll: poll.status === 'active' ? updatedPoll : event.activePoll
    });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden">
      {/* Event Header */}
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onLeave} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
            <X size={20} />
          </button>
          <div>
            <h1 className="font-bold text-sm md:text-base text-indigo-900">{event.title}</h1>
            <div className="flex items-center gap-1 text-xs text-rose-500 font-mono font-bold">
              <Hash size={12} /> {event.code}
            </div>
          </div>
        </div>

        {/* Role Switcher (Hidden in real prod, visible for demo) */}
        <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
          <button 
            onClick={() => setRole('participant')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${role === 'participant' ? 'bg-white shadow-sm text-indigo-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Smartphone size={14} /> View as Employee
          </button>
          <button 
            onClick={() => setRole('host')}
            className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 transition-all ${role === 'host' ? 'bg-white shadow-sm text-indigo-900' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Monitor size={14} /> View as Host
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Navigation Sidebar/Bottom Bar */}
        <div className={`
          flex md:flex-col justify-evenly md:justify-start items-center md:items-stretch
          bg-white border-t md:border-t-0 md:border-r border-slate-200 
          fixed md:relative bottom-0 w-full md:w-64 h-16 md:h-full z-20 
          md:pt-6 md:px-4
        `}>
          <button 
            onClick={() => setActiveTab('qa')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 md:rounded-lg transition-colors ${activeTab === 'qa' ? 'text-indigo-900 bg-indigo-50 font-bold ring-1 ring-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <MessageSquare size={20} />
            <span className="text-sm">Q&A</span>
            {event.questions.filter(q => !q.answered).length > 0 && (
               <Badge variant="success">{event.questions.filter(q => !q.answered).length}</Badge>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('polls')}
            className={`flex-1 md:flex-none flex items-center justify-center md:justify-start gap-3 px-4 py-3 md:rounded-lg transition-colors ${activeTab === 'polls' ? 'text-indigo-900 bg-indigo-50 font-bold ring-1 ring-indigo-200' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <BarChart2 size={20} />
            <span className="text-sm">Live Polls</span>
            {event.activePoll && (
               <span className="flex h-2 w-2 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
               </span>
            )}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-50 overflow-y-auto pb-20 md:pb-0 h-full w-full">
          <div className="max-w-3xl mx-auto p-4 md:p-8 min-h-full">
            {activeTab === 'qa' ? (
              <QASection 
                questions={event.questions} 
                role={role} 
                onAdd={addQuestion} 
                onLike={toggleLike}
                onAnswer={toggleAnswered}
                onDelete={deleteQuestion}
              />
            ) : (
              <PollsSection 
                polls={event.polls} 
                activePoll={event.activePoll}
                role={role} 
                onCreate={createPoll}
                onActivate={activatePoll}
                onStop={stopPoll}
                onVote={votePoll}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Section: Q&A ---

const QASection = ({ questions, role, onAdd, onLike, onAnswer, onDelete }) => {
  const [inputText, setInputText] = useState('');
  const [authorName, setAuthorName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onAdd(inputText, authorName);
    setInputText('');
  };

  const sortedQuestions = [...questions].sort((a, b) => {
    if (a.answered !== b.answered) return a.answered ? 1 : -1;
    if (a.likes !== b.likes) return b.likes - a.likes;
    return b.created - a.created;
  });

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Ask Box */}
      <Card className="p-4 shadow-md border-0 bg-white sticky top-0 z-10 ring-1 ring-slate-100">
         <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <textarea 
                placeholder={role === 'host' ? "Add a seed question..." : "Ask your question..."}
                className="w-full resize-none bg-slate-50 border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-indigo-100 outline-none text-slate-800"
                rows={2}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if(e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
              />
              <div className="flex justify-between items-center">
                {role === 'participant' ? (
                  <input 
                    type="text"
                    placeholder="Your name (optional)"
                    className="bg-transparent text-xs text-slate-500 focus:outline-none"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                  />
                ) : (
                  <span className="text-xs text-indigo-600 font-medium">Adding as Moderator</span>
                )}
                <Button 
                  onClick={handleSubmit} 
                  disabled={!inputText.trim()} 
                  className="rounded-full px-6 py-1.5 h-8 text-sm bg-rose-500 hover:bg-rose-600 text-white"
                >
                  Send
                </Button>
              </div>
            </div>
         </form>
      </Card>

      {/* Questions Feed */}
      <div className="flex flex-col gap-4 pb-20">
        {questions.length === 0 ? (
          <div className="text-center text-slate-400 py-12 flex flex-col items-center gap-2">
            <MessageSquare size={48} className="text-slate-200" />
            <p>No questions yet.</p>
          </div>
        ) : (
          sortedQuestions.map(q => (
            <div key={q.id} className={`bg-white p-4 rounded-xl border border-slate-200 shadow-sm transition-all ${q.answered ? 'opacity-60 bg-slate-50' : ''}`}>
              <div className="flex gap-4">
                <div className="flex flex-col items-center gap-1 min-w-[3rem]">
                  <button 
                    onClick={() => onLike(q.id)}
                    className="p-2 hover:bg-indigo-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors group"
                  >
                    <ThumbsUp size={20} className={q.likes > 0 ? 'fill-indigo-100 text-indigo-600' : ''} />
                  </button>
                  <span className={`text-sm font-bold ${q.likes > 0 ? 'text-indigo-900' : 'text-slate-400'}`}>{q.likes}</span>
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600">{q.author}</span>
                      <span className="text-[10px] text-slate-300">• {new Date(q.created).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    {role === 'host' && (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => onAnswer(q.id)}
                          title={q.answered ? "Mark active" : "Mark answered"}
                          className={`p-1.5 rounded hover:bg-slate-100 ${q.answered ? 'text-indigo-600' : 'text-slate-400'}`}
                        >
                          <Check size={16} />
                        </button>
                         <button 
                          onClick={() => onDelete(q.id)}
                          title="Archive"
                          className="p-1.5 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
                        >
                          <Archive size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="text-slate-800 leading-relaxed">{q.text}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// --- Sub-Section: Polls ---

const PollsSection = ({ polls, activePoll, role, onCreate, onActivate, onStop, onVote }) => {
  const [createMode, setCreateMode] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    setHasVoted(false);
  }, [activePoll?.id]);

  if (role === 'host') {
    return (
      <div className="flex flex-col gap-6 pb-20">
        
        {/* Active Poll Card */}
        {activePoll ? (
          <Card className="border-indigo-200 ring-4 ring-indigo-50">
            <div className="bg-indigo-50 border-b border-indigo-100 px-4 py-3 flex justify-between items-center">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm uppercase tracking-wide">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                </span>
                Live Now
              </div>
              <Button onClick={onStop} variant="secondary" className="text-xs h-8 px-3 text-rose-600 border-rose-100 hover:bg-rose-50">
                Stop Voting
              </Button>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-6">{activePoll.question}</h3>
              <PollResults poll={activePoll} />
            </div>
          </Card>
        ) : (
          <div className="bg-slate-100 border-2 border-dashed border-slate-300 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-4">
             <div className="bg-white p-3 rounded-full shadow-sm">
                <BarChart2 className="text-slate-400" size={32} />
             </div>
             <div className="text-slate-500">
               <p className="font-medium text-slate-700">No poll is currently active</p>
               <p className="text-sm">Activate a poll below or create a new one.</p>
             </div>
             {!createMode && (
               <Button onClick={() => setCreateMode(true)} icon={Plus}>Create new poll</Button>
             )}
          </div>
        )}

        {/* Poll Creator */}
        {createMode && (
          <PollCreator 
            onCancel={() => setCreateMode(false)} 
            onSubmit={(data) => {
              onCreate(data);
              setCreateMode(false);
            }} 
          />
        )}

        {/* Saved Polls List */}
        {!createMode && polls.length > 0 && (
          <div className="flex flex-col gap-3">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Session Polls</h4>
             {polls.map(poll => (
               <div key={poll.id} className={`bg-white border rounded-lg p-4 flex items-center justify-between shadow-sm ${poll.id === activePoll?.id ? 'border-indigo-500 ring-1 ring-indigo-500 bg-indigo-50' : 'border-slate-200'}`}>
                 <div>
                   <h5 className="font-semibold text-slate-800">{poll.question}</h5>
                   <p className="text-xs text-slate-500 mt-1 capitalize">{poll.type} • {poll.totalVotes} votes</p>
                 </div>
                 <div className="flex gap-2">
                   {poll.status !== 'active' && (
                     <button onClick={() => onActivate(poll.id)} className="p-2 bg-indigo-100 text-indigo-700 rounded-full hover:bg-indigo-200 transition-colors" title="Launch">
                       <Play size={18} fill="currentColor" />
                     </button>
                   )}
                 </div>
               </div>
             ))}
          </div>
        )}
      </div>
    );
  }

  // --- Participant View ---
  return (
    <div className="h-full flex flex-col justify-center max-w-md mx-auto">
      {activePoll ? (
        <Card className="shadow-lg border-0 md:border">
          <div className="p-6 md:p-8">
            <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-6 leading-snug">{activePoll.question}</h3>
            
            {hasVoted ? (
               <div className="animate-in fade-in duration-500">
                 <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full mb-3">
                      <Check size={24} />
                    </div>
                    <p className="text-slate-600 font-medium">Thank you for your feedback!</p>
                 </div>
                 <PollResults poll={activePoll} />
                 <button 
                  onClick={() => setHasVoted(false)} 
                  className="mt-6 text-sm text-slate-400 hover:text-slate-600 underline w-full text-center"
                 >
                   Change answer
                 </button>
               </div>
            ) : (
              <div className="flex flex-col gap-3">
                {activePoll.options.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onVote(activePoll.id, opt.id);
                      setHasVoted(true);
                    }}
                    className="group relative flex items-center p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all text-left"
                  >
                    <span className="flex-1 font-medium text-slate-700 group-hover:text-indigo-900">{opt.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>
      ) : (
         <div className="text-center text-slate-400 flex flex-col items-center gap-4">
            <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center">
              <BarChart2 size={48} className="text-slate-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-700">Waiting for poll...</h3>
              <p>The host will launch the next question soon.</p>
            </div>
         </div>
      )}
    </div>
  );
};

const PollResults = ({ poll }) => {
  const maxVotes = Math.max(...poll.options.map(o => o.votes), 1);
  
  return (
    <div className="flex flex-col gap-4">
      {poll.options.map(opt => {
        const percentage = Math.round((opt.votes / (poll.totalVotes || 1)) * 100);
        return (
          <div key={opt.id} className="relative">
            <div className="flex justify-between text-sm mb-1 font-medium z-10 relative">
              <span className="text-slate-700">{opt.text}</span>
              <span className="text-slate-500">{percentage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
               <div 
                 className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
                 style={{ width: `${percentage}%` }}
               />
            </div>
          </div>
        );
      })}
      <div className="text-right text-xs text-slate-400 mt-2">
        {poll.totalVotes} votes total
      </div>
    </div>
  );
};

const PollCreator = ({ onCancel, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ id: '1', text: '' }, { id: '2', text: '' }]);

  const updateOption = (id, text) => {
    setOptions(options.map(o => o.id === id ? { ...o, text } : o));
  };

  const addOption = () => {
    setOptions([...options, { id: Date.now().toString(), text: '' }]);
  };

  const removeOption = (id) => {
    if(options.length > 2) {
      setOptions(options.filter(o => o.id !== id));
    }
  };

  const handleSave = () => {
    if (!question.trim()) return;
    const validOptions = options.filter(o => o.text.trim());
    if (validOptions.length < 2) return;

    onSubmit({
      type: 'choice',
      question,
      options: validOptions.map(o => ({ ...o, votes: 0 })),
    });
  };

  return (
    <Card className="p-6 animate-in slide-in-from-bottom-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800">New Poll Question</h3>
        <button onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
      </div>
      
      <div className="flex flex-col gap-4">
        <input 
          autoFocus
          type="text" 
          placeholder="e.g. How helpful was today's session?"
          className="w-full text-lg font-bold border-b border-slate-200 py-2 focus:border-indigo-500 focus:outline-none placeholder-slate-300 bg-transparent"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        
        <div className="flex flex-col gap-2">
          {options.map((opt, idx) => (
             <div key={opt.id} className="flex items-center gap-2">
               <span className="text-xs font-bold text-slate-300 w-4">{idx + 1}</span>
               <input 
                  type="text" 
                  placeholder={`Option ${idx + 1}`}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={opt.text}
                  onChange={(e) => updateOption(opt.id, e.target.value)}
               />
               {options.length > 2 && (
                 <button onClick={() => removeOption(opt.id)} className="text-slate-300 hover:text-red-400">
                   <Trash2 size={16} />
                 </button>
               )}
             </div>
          ))}
          <button 
            onClick={addOption}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 self-start mt-1 flex items-center gap-1"
          >
            <Plus size={16} /> Add option
          </button>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 mt-2">
          <div className="flex gap-3">
             <Button variant="ghost" onClick={onCancel}>Cancel</Button>
             <Button onClick={handleSave} disabled={!question.trim() || options.filter(o => o.text.trim()).length < 2}>
               Launch Poll
             </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};