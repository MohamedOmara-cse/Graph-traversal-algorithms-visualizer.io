document.addEventListener('DOMContentLoaded', (event) => {
const roads={
    'shibin':['elshohada','menouf','tala','elbagour','berket','ashmon','quesna','elsadat'],
    'sirs':['menouf','elbagour' ],
    'menouf':['sirs','shibin', 'elsadat'] ,
    'elbagour':['shibin','sirs'],
    'elsadat':['shibin','menouf'],
    'ashmon':['shibin'],
    'elshohada':['shibin'],
    'quesna':['shibin'],
    'tala':['shibin'],
    'berket':['shibin']
}

const mapRoads ={
    'shibin':['menouf','tala','elbagour','elshohada','elsadat','berket','ashmon','quesna'],
    'sirs':['menouf','elbagour' ],
    'elsadat':['menouf']
}

const svg=document.getElementById("svg");

function draw()
{
  for(s in roads){

    const x=document.getElementById(`${s}`).cx.animVal.value;
    const y=document.getElementById(`${s}`).cy.animVal.value;
    const name= document.createElementNS("http://www.w3.org/2000/svg", "text");
    name.setAttribute("x",`${x+50}`);
    name.setAttribute("y",`${y+50}`);
    
    name.innerHTML=s;
    svg.appendChild(name);
  }  
 for(i in mapRoads){
     const xStart=document.getElementById(`${i}`).cx.animVal.value;
     const yStart=document.getElementById(`${i}`).cy.animVal. value;
     
     for(j in mapRoads[i]){
        const xDist=document.getElementById(`${mapRoads[i][j]}`).cx.animVal.value;
        const yDist=document.getElementById(`${mapRoads[i][j]}`).cy.animVal.value;
        const line= document.createElementNS("http://www.w3.org/2000/svg", "line");
        
        line.setAttribute("x1",`${xStart}`);
        line.setAttribute("y1",`${yStart}`);
        line.setAttribute("x2",`${xDist}`);
        line.setAttribute("y2",`${yDist}`);
        line.setAttribute("stroke",'black');
        line.setAttribute("stroke-width",'5px');
        svg.appendChild(line);
     }
     
 }
}
draw();


// DFS function    
  let dfsFound=0 ;
    visited=new Set();
function dfs(start,distination,visited=new Set())
{
    visited.add(start);
   console.log(start);
    for (const road of roads[start]) {
        if(dfsFound==1){break;}        // a child was already DFSed and reached the goal( child altered the dfsFound var )
        else if(road==distination){   // GOAL REACHED
            console.log('founded');
            visited.add(distination);
            dfsFound=1;
            break;
        }
       else if (!visited.has(road)) {  // first time to explore
            dfs(road,distination, visited);
        }
       
    }
    return visited;

}
// generating an enent

function activatePath(visited){
    console.log(visited);
    let i=0;
    visited.forEach(element => {
        i += 1;
        setTimeout(()=>{
            console.log(element)
            console.log(document.querySelector(`#${element}`))
            document.querySelector(`#${element}`).style.fill = 'red';
        },i*1000);
        
    })
        
};


document.getElementById('form').addEventListener('submit',(e)=>{
    
    
   
  
  //Getting the form values on submit
    const start=document.getElementById('startCities').value;
    const distination=document.getElementById('distCities').value;
    const algo=document.getElementById('algorithem').value;
    console.table(start, distination, algo);
   if (algo=="dfs"){
       visited.clear();
       dfsFound=0;
       const results=dfs(start,distination);
       console.log(results);
        activatePath(results);
      
   }

  
 



   e.preventDefault();

    

   
   
   
   
  




})











});