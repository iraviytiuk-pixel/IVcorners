import { designKnowledge } from '../knowledge/airena-knowledge.mjs';
export const interview=designKnowledge.interview;
export function getDemoReply(text,brief,state){
 const lower=text.toLowerCase(),nextBrief={...brief},actions=[];let response='';
 const command=lower.match(/\b(?:add|place|bring in|put in)\s+(?:a |an |the |another )?(?:reading |floor |linen |stone |walnut )?(sofa|chair|table|plant|rug|lamp|console|sideboard)\b/);
 if(command){const kind=command[1]==='console'?'sideboard':command[1];return{reply:`A ${kind} could be a good next layer. I’ll look for an open position when you add it. You can then drag it into place.`,choices:['Continue my design brief','Try a warmer palette'],actions:[{type:'add_item',value:kind,label:`Add ${kind}`}],brief:nextBrief}}
 if(/\b(what can you|help|how do i)\b/.test(lower))return{reply:'I can guide your design brief, suggest a material palette, and offer pieces from our sample collection. Try “add a reading chair,” choose a feeling below, or tell me how you use the room. This is a guided demo, so open-ended design reasoning comes with the live AI connection.',choices:['Warm & collected','Add a plant','Continue my design brief'],actions:[],brief:nextBrief};
 const paletteMatch= /\b(burgundy|bold|expressive|dark wood)\b/.test(lower)?2:/\b(quiet|minimal|green|calm|scandi)\b/.test(lower)?1:/\b(warm|earthy|neutral|cozy|cosy)\b/.test(lower)?0:null;
 if(paletteMatch!==null&&!/\b(no |not |avoid |hate |dislike ).*(warm|bold|green|burgundy|neutral|minimal)/.test(lower))actions.push({type:'set_palette',value:String(paletteMatch),label:['Try the warm edit','Try the quiet edit','Try the bold edit'][paletteMatch]});
 const stage=interview.find(q=>!nextBrief[q.key]);
 if(stage && !/^(continue my design brief|try a warmer palette)$/i.test(text)){
  nextBrief[stage.key]=text.slice(0,500);
  const dimensions=lower.match(/\b(\d{2}(?:\.5)?)\s*(?:x|×|by)\s*(\d{2}(?:\.5)?)\b/);
  if(dimensions){const w=+dimensions[1],d=+dimensions[2];if(w>=10&&w<=30&&d>=10&&d<=30)actions.push({type:'set_dimensions',value:`${w},${d}`,label:`Use ${w} × ${d} ft`})}
  response={life:'That gives us a starting point. The layout should support your everyday rituals, not just look good in a picture.',space:'I’ve added that to your brief. We’ll treat the dimensions you confirm as the starting point, then verify openings and circulation.',light:'I’ve noted the light and openings. The window in the 3D scene is illustrative; we’ll need measured positions before making fit decisions.',keep:'Those pieces should help tell the story. We’ll work around what you love and confirm its size before choosing anything new.',taste:'I’m starting to see the direction. We can bring that feeling into the room through texture, proportion, and a little contrast.',color:'A focused palette will give the room a sense of belonging. Try the material study below and see how it feels.',budget:'I’ve noted your budget. The pieces here are examples without live prices; a verified catalog will let us make a real spending plan.',needs:'That belongs in the design from the start. I’ve gathered your brief below so we can keep those everyday needs in view.'}[stage.key];
 }
 const next=interview.find(q=>!nextBrief[q.key]);
 if(!response)response=actions.length?'Let’s explore that direction. You can apply the material study below, and undo it if it doesn’t feel right.':'Your brief is ready to explore. Move a piece, try another palette, or ask me to add something from the collection. For now, my responses are a guided prototype.';
 return{reply:response+(next?'\n\n'+next.question:''),choices:next?next.choices:['Add a floor lamp','Try a warmer palette','Add a plant'],actions,brief:nextBrief};
}
