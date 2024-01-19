fetch("https://api.github.com/users/Satvik-Rave/repos")
    .then((res)=>{return res.json();})
    .then(async (data)=>{
        // console.log(data);
        for (let i = 0; i < data.length; i++) {
            var ele = data[i];
            // console.log(ele);
            var name=ele.name;
            var description=ele.description;
            var langsStr=await getStr(name);
            // console.log(langsStr);
            var update=`<div class="repos"><div class="repo"><h2>${name}</h2><div class="bio">${description}</div><div class="languages">${langsStr}</div></div></div>`;
            document.getElementById("c2").innerHTML+=update;
        }
    });
async function getStr(name) {
    var langsStr="";
    await fetch(`https://api.github.com/repos/Satvik-Rave/${name}/languages`)
    .then((res)=>{return res.json();})
    .then((data)=>{
        langs=Object.keys(data);
        // console.log(langs.length);
        var num=0;
        if(langs.length>6){
            num=6;
        }
        else{
            num=langs.length;
        }
        // console.log(num);
        for (let j = 0; j < num; j++) {
            const element = langs[j];
            langsStr+=`<div class="lang">${element}</div>`;
        }
    });
    // console.log(langsStr);
    return langsStr;
}
