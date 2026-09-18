import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Search, PanelLeftClose, Plus, MessageSquare, FileText, CircleCheck, Users, BarChart3, ChevronRight, Pencil, Paperclip, Send, Check, Info, Sparkles, CalendarDays, CircleDollarSign, ListChecks, Clock3, Menu, type LucideIcon } from 'lucide-react'
import './styles.css'

type Flow = 'business' | 'manager' | 'procurement'
type Detail = { label: string; value: string; sub?: string }

const details: Detail[] = [
  { label: 'Request type', value: 'New supplier' },
  { label: 'Service', value: 'Travel management services' },
  { label: 'Location', value: 'France' },
  { label: 'Number of employees', value: '~500 employees' },
  { label: 'Target start date', value: '1 January 2027' },
  { label: 'Employee personal data', value: 'Yes', sub: 'Traveller names, contact details, booking information' },
  { label: 'Additional notes', value: 'Include 24/7 support' },
]

const flows = {
  business: ['Dashboard', 'Prompt entered', 'Intake · collapsed', 'Intake · overview', 'Draft generated', 'Draft updated', 'Edit information', 'Submitted', 'Request details'],
  manager: ['Dashboard', 'Prompt entered', 'Review · collapsed', 'Review · overview', 'Add documents', 'Send confirmation', 'Request sent', 'Edit information'],
  procurement: ['Dashboard', 'Prompt entered', 'Request overview', 'Analysis', 'Edit information', 'Saved', 'Information needed', 'Send confirmation', 'Request sent'],
} as const

function App() {
  const [flow, setFlow] = useState<Flow>('business')
  const [step, setStep] = useState(0)
  const [sidebar, setSidebar] = useState(true)
  const [message, setMessage] = useState('')
  const max = flows[flow].length - 1
  const role = flow === 'business' ? 'Business Manager' : flow === 'manager' ? 'Contract Manager' : 'Procurement Manager'
  const person = flow === 'business' ? 'John Dupont' : 'Catherine Moreau'
  const go = (next: number) => setStep(Math.max(0, Math.min(next, max)))
  const changeFlow = (f: Flow) => { setFlow(f); setStep(0); setMessage('') }

  return <div className="app-shell">
    <button className="mobile-menu" onClick={() => setSidebar(v => !v)} aria-label="Toggle navigation"><Menu size={20}/></button>
    {sidebar && <Sidebar flow={flow} person={person} role={role} onCollapse={() => setSidebar(false)} onNew={() => go(0)} />}
    <main className="workspace">
      <FlowTabs flow={flow} step={step} setFlow={changeFlow} setStep={go}/>
      {step < 2 ? <Home flow={flow} step={step} onContinue={() => go(step + 1)} /> :
        <Conversation flow={flow} step={step} go={go} max={max} message={message} setMessage={setMessage}/>} 
    </main>
    {step >= 2 && <Overview flow={flow} step={step}/>} 
  </div>
}

function FlowTabs({flow, step, setFlow, setStep}:{flow:Flow;step:number;setFlow:(f:Flow)=>void;setStep:(n:number)=>void}) {
  return <nav className="prototype-nav" aria-label="Prototype screen navigation">
    <label>Prototype flow
      <select value={flow} onChange={e => setFlow(e.target.value as Flow)}>
        <option value="business">Business Owner</option><option value="manager">Contract Manager</option><option value="procurement">Procurement</option>
      </select>
    </label>
    <label>Screen
      <select value={step} onChange={e => setStep(Number(e.target.value))}>
        {flows[flow].map((name,i)=><option value={i} key={name}>{i+1}. {name}</option>)}
      </select>
    </label>
  </nav>
}

function Sidebar({flow,person,role,onCollapse,onNew}:{flow:Flow;person:string;role:string;onCollapse:()=>void;onNew:()=>void}) {
  const nav: Array<[string, LucideIcon]> = flow === 'business' ? [['My requests',MessageSquare],['Contracts',FileText],['Approvals',CircleCheck]] : [['Approvals',CircleCheck],['Contracts',FileText],['My requests',MessageSquare],['Supplier',Users],['Insights',BarChart3]]
  return <aside className="sidebar">
    <header className="brand"><div className="sg-mark"><i/>SOCIETE<br/><span>GENERALE</span></div><button aria-label="Search"><Search/></button><button aria-label="Collapse sidebar" onClick={onCollapse}><PanelLeftClose/></button><small>Contract Lifecycle Management</small></header>
    <button className="new-chat" onClick={onNew}><Plus/> New chat</button>
    <nav className="side-nav">{nav.map(([label,Icon])=><button key={label}><Icon/>{label}{label==='Approvals'&&<b>2</b>}</button>)}</nav>
    <section className="recents"><h3>⌄ &nbsp; RECENTS</h3>{['REQ-2026-0187','Renewal review - Cloud','Supplier onboarding','Clause clarification','Risk review - Data privacy'].map((x,i)=><button className={i===0?'active':''} key={x}><MessageSquare/><span>{x}<small>{i===0?'Today, 10:24':i===1?'Yesterday, 15:10':`${12-i*2} Sep 2026`}</small></span></button>)}</section>
    <footer><span className="avatar">{person.split(' ').map(x=>x[0]).join('')}</span><span>{person}<small>{role}</small></span><b>•••</b></footer>
  </aside>
}

function Home({flow,step,onContinue}:{flow:Flow;step:number;onContinue:()=>void}) {
  const procurement = flow==='procurement'
  const manager = flow==='manager'
  const name = flow==='business'?'John':'Catherine'
  const prompt = flow==='business'?'I need a new travel management supplier for our France offices':'Review supplier request REQ-2026-0187'
  return <section className="home"><div className="red-dash"/><p>Good morning, {name}</p><h1>What would you like to do today?</h1>
    <button className={`prompt-box ${step===1?'filled':''}`} onClick={onContinue} aria-label="Start request"><span>{step===1?prompt:'Tell me what you need, e.g. “I need a new travel management supplier for our France offices”'}</span><Plus/><i><Send/></i></button>
    <h3>SUGGESTED STARTS</h3><div className="suggestions">
      {(procurement?['Review this supplier contract','Compare this amendment','Amend an existing contract','Review supplier requests']:manager?['Review supplier requests','Follow up on information','Renew or extend a contract','Amend an existing contract']:['Get a supplier or contract','Check the status of my requests','Renew or extend a contract','Make a change to a contract']).map((x,i)=><button onClick={onContinue} key={x}><span>{[<Users/>,<MessageSquare/>,<Clock3/>,<Pencil/>][i]}</span>{x}<ChevronRight/></button>)}
    </div><h2>My activity</h2><div className="activity">{[['2','My review tasks'],['1','Approvals to review'],['2','Waiting for my input'],['2','Upcoming renewals'],['1','Waiting on others']].map(([n,l])=><div key={l}><b>{n}</b><span>{l}</span></div>)}</div>
  </section>
}

function Conversation({flow,step,go,max,message,setMessage}:{flow:Flow;step:number;go:(n:number)=>void;max:number;message:string;setMessage:(s:string)=>void}) {
  const next=()=>go(step+1)
  return <section className="conversation">
    <header><h1>{flow==='business'?'New contract request':flow==='manager'?'Review request':'REQ-2026-0187'}</h1></header>
    {flow==='business'?<Business step={step} next={next}/>:flow==='manager'?<Manager step={step} next={next}/>:<Procurement step={step} next={next}/>} 
    <div className="composer"><button aria-label="Add attachment"><Plus/></button><input aria-label="Message" value={message} onChange={e=>setMessage(e.target.value)} placeholder="Type your answer or say what you want to change..."/><button className="send" onClick={()=>{setMessage(''); if(step<max)next()}} aria-label="Send message"><Send/></button></div>
  </section>
}

function Business({step,next}:{step:number;next:()=>void}) {
  if(step<=3) return <>
    <p>Good morning, John.<br/>I can help you create a new contract. To get started, I’ll ask a few questions.</p>
    <Question title="What type of contract do you need?" options={['New supplier','Amend existing contract','Renewal','Other']} selected="New supplier"/>
    <UserBubble>New supplier</UserBubble>
    <Question title="What goods or services will the supplier provide?"/><UserBubble>Travel management services for our France offices.</UserBubble>
    <Question title="In which country or region will the services be provided?" options={['France','EMEA (multiple countries)','Global','Other']} selected="France"/>
    <UserBubble>France</UserBubble>
    <Question title="About how many employees will use the service?" options={['1-50','51-250','251-500','501-1,000','More than 1,000']} selected="251-500"/>
    <Question title="When do you need the contract to be in place?" options={['Within 1 month','1-3 months','3-6 months','6-12 months','Later']} selected="6-12 months"/>
    <div className="actions"><button className="primary" onClick={next}>Continue</button></div>
  </>
  if(step===6) return <><p>Select any field and update the request information.</p><EditForm onSave={next}/></>
  if(step>=7) return <><UserBubble>Everything looks good. Please submit the request.</UserBubble><RequestCard title={step===7?'Confirm and submit':'Your request has been submitted'} status="Submitted"/><div className="notice"><CircleCheck/><div><b>{step===7?'Ready to submit':'Your request has been submitted'}</b><p>{step===7?'Please confirm the information above.':'Request REQ-2026-0187 has been routed for review.'}</p></div></div>{step===7&&<div className="actions"><button onClick={()=>next()}>Make a change</button><button className="primary" onClick={next}>Submit request</button></div>}</>
  return <><p>Great. I’ve prepared a draft request based on the information you provided. Please review the details below.</p><RequestCard title="Draft request" status={step===4?'Draft':'Updated'}/>{step===5&&<><UserBubble>Looks good. Please add a note that the contract should include 24/7 support.</UserBubble><p>I’ve added the note. Here is the updated draft for your review.</p><RequestCard title="Draft request" status="Updated"/></>}<div className="actions"><button onClick={next}>{step===4?'Update request':'Edit information'}</button><button className="primary" onClick={next}>{step===4?'Looks good':'Continue'}</button></div></>
}

function Manager({step,next}:{step:number;next:()=>void}) {
  if(step<=3) return <><p>John Dupont has submitted a new supplier request for travel management services.<br/>I’ve reviewed the information available. Please check the key details below.</p><RequestCard title="REQ-2026-0187" status="Pending review"/><div className="review-points"><Sparkles/><div><b>Key points for your review</b><ol><li>This is a new supplier request. No supplier has been selected yet.</li><li>Employee personal data is involved, so <b>Privacy and Security</b> reviews will be required.</li><li>Please confirm the request is complete and correctly routed to Procurement.</li></ol></div></div><div className="actions"><button className="primary" onClick={next}>Send to Procurement</button><button>Request more information</button><button>Escalate</button><button>More options</button></div></>
  if(step===4) return <><p>I want to add the travel policy and internal approval email as supporting documents.</p><div className="documents"><h2>Supporting documents (2)</h2>{['Travel_Policy.pdf','Approval_Email.pdf'].map((x,i)=><div key={x}><FileText/><span><b>{x}</b><small>{i?'1.3 MB':'2.4 MB'} • Internal document</small></span><Check/></div>)}<button><Paperclip/> Add another document</button></div><div className="actions"><button className="primary" onClick={next}>Send to Procurement</button><button>Make another change</button></div></>
  if(step===7) return <><p>What do you want to edit?</p><EditForm onSave={next}/></>
  return <><div className="notice success"><CircleCheck/><div><b>{step===5?'Ready to send to Procurement':'Request sent to Procurement'}</b><p>{step===5?'The request is complete and meets the required information for sourcing.':'The request has been successfully transferred to the Procurement team.'}</p></div></div><RequestCard title="New supplier request" status="In procurement"/><div className="actions">{step===5&&<button onClick={()=>next()}>Make another change</button>}<button className="primary" onClick={next}>{step===5?'Send to Procurement':'View request status'}</button></div></>
}

function Procurement({step,next}:{step:number;next:()=>void}) {
  if(step<=3) return <><p>REQ-2026-0187 has been reviewed by Catherine Moreau and is ready for sourcing.</p><RequestCard title="New supplier request" status="Ready for sourcing"/><UserBubble>Yes, please prepare the sourcing case.</UserBubble><div className="analysis-card"><span className="loader"/><div><b>Analysing request...</b><p>Reviewing request details · Checking required inputs · Preparing sourcing plan</p></div></div><div className="actions"><button className="primary" onClick={next}>{step===3?'View analysis':'Prepare sourcing case'}</button></div></>
  if(step===4) return <><p>Edit information</p><EditForm onSave={next}/></>
  if(step===5) return <><div className="notice success"><CircleCheck/><div><b>Saved successfully</b><p>The sourcing information has been updated.</p></div></div><RequestCard title="New supplier request" status="Saved"/><div className="actions"><button className="primary" onClick={next}>Continue review</button></div></>
  if(step===6) return <><p>I’ve reviewed the request. A few items are still missing before we can prepare the sourcing case.</p><div className="info-needed"><h2><Search/> Information needed</h2>{[[CircleDollarSign,'Budget / commercial range','Estimated annual value or range'],[ListChecks,'Evaluation criteria','e.g. price, service, implementation, security'],[CalendarDays,'Supplier response deadline','Proposed date for supplier submissions'],[Info,'Additional requirements (optional)','e.g. sustainability, local presence, diverse suppliers']].map(([Icon,t,s])=><div key={String(t)}><Icon/><span><b>{String(t)}</b><small>{String(s)}</small></span><button>Add</button></div>)}</div><UserBubble>Budget is around €800k to €1M annually. Use price, service coverage, implementation and security as evaluation criteria. Set the supplier response deadline to 30 September 2026.</UserBubble><div className="notice success"><CircleCheck/><div><b>Information updated</b><p>All required details are now available.</p></div></div><div className="actions"><button className="primary" onClick={next}>Yes, confirm sourcing route</button><button>Review details first</button></div></>
  return <><p>Please confirm that you want to send this request now.</p><RequestCard title="Ready to send to Procurement" status={step===8?'Sent':'Pending review'}/><div className="notice"><Info/><div><b>What happens next?</b><p>The request will be sent to the Procurement team for sourcing.</p></div></div><div className="actions">{step===7?<><button>Make another change</button><button className="primary" onClick={next}>Send to Procurement</button></>:<><button>View request status</button><button className="primary">Add a note</button></>}</div></>
}

function Question({title,options=[],selected}:{title:string;options?:string[];selected?:string}) { return <div className="question"><p>{title}</p>{options.length>0&&<div>{options.map(x=><button className={x===selected?'selected':''} key={x}>{x}</button>)}</div>}</div> }
function UserBubble({children}:{children:React.ReactNode}) { return <div className="user-bubble">{children}</div> }

function RequestCard({title,status}:{title:string;status:string}) { return <article className="request-card"><header><span><FileText/><b>{title}</b><small>New supplier</small></span><em>{status}</em></header><div className="detail-grid">{details.map(d=><div key={d.label}><b>{d.label}</b><span>{d.value}</span>{d.sub&&<small>{d.sub}</small>}</div>)}</div><footer><Paperclip/> <b>Supporting documents (2)</b><span>Travel_Policy.pdf, Approval_Email.pdf</span><ChevronRight/></footer></article> }

function EditForm({onSave}:{onSave:()=>void}) { const [employees,setEmployees]=useState('500 employees'); const [note,setNote]=useState('Include 24/7 support'); return <form className="edit-form" onSubmit={e=>{e.preventDefault();onSave()}}><h2>Edit information</h2><label>Request type<input value="New supplier" readOnly/></label><label>Service<input defaultValue="Travel management services"/></label><label>Location<input defaultValue="France"/></label><label>Number of employees<input value={employees} onChange={e=>setEmployees(e.target.value)} required/></label><label>Target start date<input type="date" defaultValue="2027-01-01"/></label><label>Additional notes<textarea value={note} onChange={e=>setNote(e.target.value)}/></label><div className="actions"><button type="button">Discard</button><button className="primary" type="submit">Save changes</button></div></form> }

function Overview({flow,step}:{flow:Flow;step:number}) {
  const compact=flow==='business'&&step<=3
  return <aside className="overview"><header><h2>Overview</h2><button aria-label="Close overview"><PanelLeftClose/></button></header><div className="overview-title"><FileText/><span><b>{flow==='business'?'New request':'REQ-2026-0187'}</b><small>New supplier request</small></span><em>{step>=7?'Submitted':step>=5?'Draft':'Pending review'}</em><Pencil/></div>{details.slice(0,compact?6:7).map(d=><div className="overview-row" key={d.label}><b>{d.label}</b><span>{d.value}</span>{d.sub&&<small>{d.sub}</small>}</div>)}{flow!=='business'&&<Checklist flow={flow} step={step}/>}<div className="overview-help"><Info/><div><b>{flow==='business'?'Need to make a change?':'AI recommendation'}</b><p>{flow==='business'?'Just tell me in chat, for example: “Change the number of employees to 600”.':'Review required items and confirm the sourcing route.'}</p></div></div></aside>
}

function Checklist({flow,step}:{flow:Flow;step:number}) { const items=flow==='manager'?['Request information','Supporting documents','Ownership and contract type','Existing supplier or contract checked','Risk, privacy and security identified']:['Submitted by Business User','Reviewed and approved by Contract Manager','Ready for sourcing','Supplier selection','Risk, privacy and security identified','Evaluation']; return <div className="checklist"><header><b>Review checklist</b><button>View all</button></header>{items.map((x,i)=><div className={i<(step>5?3:2)?'done':i===2?'current':''} key={x}><i>{i<(step>5?3:2)?<Check/>:''}</i><span><b>{x}</b><small>{i<2?'Complete':i===2?'With Procurement':'Needs review'}</small></span></div>)}</div> }

createRoot(document.getElementById('root')!).render(<React.StrictMode><App/></React.StrictMode>)
