const { useState, useEffect, useRef } = React;

// Setup Lucide React Icons for browser environment
const { 
  MessageSquare, BarChart2, X, ThumbsUp, Check, Play, 
  Plus, ArrowRight, Monitor, Smartphone, Hash, Trash2, 
  Archive, Activity, Star, Heart, Shield, Menu, MoreVertical
} = LucideReact;

// --- HPG Design System Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, icon: Icon }) => {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-indigo-900 hover:bg-indigo-800 text-white focus:ring-indigo-800 shadow-md",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-200 shadow-sm",
    ghost: "bg-transparent hover:bg-indigo-50 text-indigo-900",
    danger: "bg-rose-50 text-rose-600 hover:bg-rose-100 focus:ring-rose-200",
    outline: "bg-transparent border-2 border-indigo-900 text-indigo-900 hover:bg-indigo-50"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={18} className="mr-2" />}
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden ${className}`}>{children}</div>
);

const Badge = ({ children, variant = 'neutral' }) => {
  const styles = {
    neutral: "bg-slate-100 text-slate-600",
    success: "bg-rose-100 text-rose-700",
    warning: "bg-amber-100 text-amber-700",
    brand: "bg-indigo-100 text-indigo-800"
  };
  return <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[variant]}`}>{children}</span>;
};

// --- Main Application ---

function App() {
  const [view, setView] = useState('landing'); 
  const [role, setRole] = useState('participant'); 
  const [currentEventCode, setCurrentEventCode] = useState(null);
  
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

  const createEvent = (title) => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    const newEvent = { code, title: title || 'Untitled Session', created: new Date().toISOString(), questions: [], activePoll: null, polls: [] };
    setEvents(prev => ({ ...prev, [code]: newEvent }));
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
    setEvents(prev => ({ ...prev, [code]: { ...prev[code], ...updates } }));
  };

  const currentEvent = events[currentEventCode];

  if (view === 'landing') return <LandingPage onCreate={createEvent} onJoin={joinEvent} />;
  
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

// --- Page: Landing ---

const LandingPage = ({ onCreate, onJoin }) => {
  const [joinCode, setJoinCode] = useState('');
  const [createTitle, setCreateTitle] = useState('');
  const [mode, setMode] = useState('join');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <nav className="bg-indigo-900 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3 font-semibold text-xl text-white">
          <div className="bg-white text-indigo-900 p-1.5 rounded flex items-center justify-center"><Activity size={20} /></div>
          HPG | Live
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
          Helping our people <br/><span className="text-rose-500">be their best.</span>
        </h1>
        <div className="w-full max-w-md bg-white p-2 rounded-2xl shadow-xl border border-slate-200 flex flex-col gap-2">
          {mode === 'join' ? (
            <div className="flex flex-col gap-3 p-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Join Meeting</label>
              <div className="flex gap-2">
                <input 
                  type="text" placeholder="Enter code (try 2024)" 
                  className="flex-1 px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-900 outline-none"
                  value={joinCode} onChange={(e) => setJoinCode(e.target.value)}
                />
                <button onClick={() => onJoin(joinCode)} className="bg-indigo-900 text-white rounded-xl px-6"><ArrowRight size={24} /></button>
              </div>
              <button onClick={() => setMode('create')} className="text-sm text-indigo-900 font-bold hover:underline self-start">Host a session</button>
            </div>
          ) : (
            <div className="flex flex-col gap-3 p-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Host New Session</label>
              <input 
                type="text" placeholder="Session Name" 
                className="w-full px-4 py-3 bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-900 outline-none"
                value={createTitle} onChange={(e) => setCreateTitle(e.target.value)}
              />
              <Button onClick={() => onCreate(createTitle)} className="w-full">Create Session</Button>
              <button onClick={() => setMode('join')} className="text-sm text-indigo-900 font-bold hover:underline self-start">Back to join</button>
            </div>
          )}
        </div>
        <div className="mt-16 text-slate-400 text-sm">© 2026 Health Partners Group</div>
      </main>
    </div>
  );
};

// --- Page: Event Workspace ---

const EventWorkspace = ({ event, role, setRole, onLeave, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('qa');

  const addQuestion = (text, author) => {
    const newQ = { id: Date.now(), text, author: author || 'Anonymous', likes: 0, answered: false, created: Date.now() };
    onUpdate({ questions: [newQ, ...event.questions] });
  };

  const toggleLike = (id) => {
    onUpdate({ questions: event.questions.map(q => q.id === id ? { ...q, likes: q.likes + 1 } : q) });
  };

  const toggleAnswered = (id) => {
    onUpdate({ questions: event.questions.map(q => q.id === id ? { ...q, answered: !q.answered } : q) });
  };

  const deleteQuestion = (id) => {
    onUpdate({ questions: event.questions.filter(q => q.id !== id) });
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
    onUpdate({ polls: updatedPolls, activePoll: updatedPolls.find(p => p.id === pollId) });
  };

  const stopPoll = () => {
    onUpdate({ polls: event.polls.map(p => ({ ...p, status: p.status === 'active' ? 'ended' : p.status })), activePoll: null });
  };

  const votePoll = (pollId, optionId) => {
    const pollIndex = event.polls.findIndex(p => p.id === pollId);
    if (pollIndex === -1) return;
    const poll = event.polls[pollIndex];
    const updatedOptions = poll.options.map(o => o.id === optionId ? { ...o, votes: o.votes + 1 } : o);
    const updatedPoll = { ...poll, options: updatedOptions, totalVotes: poll.totalVotes + 1 };
    const newPolls = [...event.polls];
    newPolls[pollIndex] = updatedPoll;
    onUpdate({ polls: newPolls, activePoll: poll.status === 'active' ? updatedPoll : event.activePoll });
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      <header className="bg-white border-b h-16 flex items-center justify-between px-4 z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onLeave} className="p-2 hover:bg-slate-100 rounded-full text-slate-500"><X size={20} /></button>
          <div>
            <h1 className="font-bold text-indigo-900">{event.title}</h1>
            <div className="flex items-center gap-1 text-xs text-rose-500 font-bold"><Hash size={12} /> {event.code}</div>
          </div>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1 border">
          <button onClick={() => setRole('participant')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 ${role === 'participant' ? 'bg-white shadow-sm text-indigo-900' : 'text-slate-500'}`}><Smartphone size={14} /> Employee</button>
          <button onClick={() => setRole('host')} className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-2 ${role === 'host' ? 'bg-white shadow-sm text-indigo-900' : 'text-slate-500'}`}><Monitor size={14} /> Host</button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="flex md:flex-col fixed md:relative bottom-0 w-full md:w-64 h-16 md:h-full bg-white border-t md:border-r z-20 md:pt-6 md:px-4">
          <button onClick={() => setActiveTab('qa')} className={`flex-1 md:flex-none flex items-center gap-3 px-4 py-3 md:rounded-lg ${activeTab === 'qa' ? 'text-indigo-900 bg-indigo-50 font-bold' : 'text-slate-500'}`}><MessageSquare size={20} /> Q&A</button>
          <button onClick={() => setActiveTab('polls')} className={`flex-1 md:flex-none flex items-center gap-3 px-4 py-3 md:rounded-lg ${activeTab === 'polls' ? 'text-indigo-900 bg-indigo-50 font-bold' : 'text-slate-500'}`}><BarChart2 size={20} /> Polls</button>
        </div>
        <div className="flex-1 overflow-y-auto pb-20 md:pb-0 p-4 md:p-8">
          <div className="max-w-3xl mx-auto">
            {activeTab === 'qa' ? (
              <QASection questions={event.questions} role={role} onAdd={addQuestion} onLike={toggleLike} onAnswer={toggleAnswered} onDelete={deleteQuestion} />
            ) : (
              <PollsSection polls={event.polls} activePoll={event.activePoll} role={role} onCreate={createPoll} onActivate={activatePoll} onStop={stopPoll} onVote={votePoll} />
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

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-4 sticky top-0 z-10">
        <textarea 
          placeholder="Ask your question..." 
          className="w-full bg-slate-50 rounded-lg p-3 text-sm outline-none" rows={2} 
          value={inputText} onChange={(e) => setInputText(e.target.value)}
        />
        <div className="flex justify-between items-center mt-2">
          <input type="text" placeholder="Name (optional)" className="text-xs bg-transparent outline-none" value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
          <Button onClick={handleSubmit} disabled={!inputText.trim()} className="bg-rose-500 h-8 text-sm">Send</Button>
        </div>
      </Card>
      <div className="flex flex-col gap-4">
        {questions.map(q => (
          <div key={q.id} className={`bg-white p-4 rounded-xl border flex gap-4 ${q.answered ? 'opacity-50' : ''}`}>
            <button onClick={() => onLike(q.id)} className="flex flex-col items-center text-slate-400 hover:text-indigo-600">
              <ThumbsUp size={20} className={q.likes > 0 ? 'fill-indigo-100 text-indigo-600' : ''} />
              <span className="text-xs font-bold">{q.likes}</span>
            </button>
            <div className="flex-1">
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                <span>{q.author}</span>
                {role === 'host' && (
                  <div className="flex gap-2">
                    <button onClick={() => onAnswer(q.id)}><Check size={16} /></button>
                    <button onClick={() => onDelete(q.id)}><Archive size={16} /></button>
                  </div>
                )}
              </div>
              <p className="text-slate-800">{q.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Sub-Section: Polls ---

const PollsSection = ({ polls, activePoll, role, onCreate, onActivate, onStop, onVote }) => {
  const [createMode, setCreateMode] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  if (role === 'host') {
    return (
      <div className="flex flex-col gap-6">
        {activePoll ? (
          <Card className="p-6 border-indigo-200 ring-4 ring-indigo-50">
            <div className="flex justify-between mb-4">
              <span className="text-rose-500 font-bold text-xs uppercase">● Live Now</span>
              <Button onClick={onStop} variant="secondary" className="h-8 text-xs text-rose-600">Stop</Button>
            </div>
            <h3 className="text-xl font-bold mb-6">{activePoll.question}</h3>
            <PollResults poll={activePoll} />
          </Card>
        ) : (
          <div className="border-2 border-dashed rounded-xl p-8 text-center">
            {!createMode ? <Button onClick={() => setCreateMode(true)} icon={Plus}>New Poll</Button> : <PollCreator onCancel={() => setCreateMode(false)} onSubmit={(d) => { onCreate(d); setCreateMode(false); }} />}
          </div>
        )}
        {!createMode && polls.map(p => (
          <div key={p.id} className="bg-white border rounded-lg p-4 flex justify-between items-center">
            <div><h5 className="font-semibold">{p.question}</h5><p className="text-xs text-slate-500">{p.totalVotes} votes</p></div>
            <button onClick={() => onActivate(p.id)} className="p-2 bg-indigo-100 text-indigo-700 rounded-full"><Play size={18} fill="currentColor" /></button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      {activePoll ? (
        <Card className="p-8">
          <h3 className="text-xl font-bold mb-6">{activePoll.question}</h3>
          {hasVoted ? <PollResults poll={activePoll} /> : (
            <div className="flex flex-col gap-3">
              {activePoll.options.map(opt => (
                <button key={opt.id} onClick={() => { onVote(activePoll.id, opt.id); setHasVoted(true); }} className="p-4 rounded-xl border-2 hover:border-indigo-500 hover:bg-indigo-50 text-left font-medium">
                  {opt.text}
                </button>
              ))}
            </div>
          )}
        </Card>
      ) : <div className="text-center text-slate-400">Waiting for poll...</div>}
    </div>
  );
};

const PollResults = ({ poll }) => (
  <div className="flex flex-col gap-4">
    {poll.options.map(opt => {
      const pct = Math.round((opt.votes / (poll.totalVotes || 1)) * 100);
      return (
        <div key={opt.id}>
          <div className="flex justify-between text-sm mb-1"><span>{opt.text}</span><span>{pct}%</span></div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${pct}%` }} />
          </div>
        </div>
      );
    })}
  </div>
);

const PollCreator = ({ onCancel, onSubmit }) => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ id: '1', text: '' }, { id: '2', text: '' }]);
  return (
    <div className="text-left">
      <input placeholder="Poll Question" className="w-full text-lg font-bold border-b mb-4 py-2 outline-none" value={question} onChange={(e) => setQuestion(e.target.value)} />
      {options.map((o, i) => (
        <input key={o.id} placeholder={`Option ${i+1}`} className="w-full bg-slate-50 border rounded-lg px-3 py-2 mb-2 outline-none" value={o.text} onChange={(e) => setOptions(options.map(opt => opt.id === o.id ? {...opt, text: e.target.value} : opt))} />
      ))}
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button onClick={() => onSubmit({ question, options: options.filter(o => o.text.trim()).map(o => ({...o, votes: 0})) })}>Launch</Button>
      </div>
    </div>
  );
};

// RENDER
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);