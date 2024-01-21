const user="mojombo";
// const user = "Satvik-Rave";
// const user="johnpapa";
// const user="milind-nair";
// const user="mansi-123";

document.querySelector(".pageNumbers").classList.add("hidden");
async function bioUpdate() {
    await fetch(`https://api.github.com/users/${user}`)
        .then((res) => { return res.json(); })
        .then(async (data) => {
            // console.log(data);
            document.getElementById("name").innerHTML = data.name;
            document.querySelector("#location span").innerText = data.location;
            if(data.location===""){
                document.querySelector(".fi-ss-marker").classList.add("hidden");
            }
            document.getElementById("link").innerHTML = data.html_url;
            document.getElementById("link").setAttribute("href",data.html_url);
            document.getElementById("bio").innerHTML = data.bio;
            document.getElementById("iconimg").setAttribute("src", data.avatar_url);
        });
};
// bioUpdate();
async function apiCall() {
    await fetch(`https://api.github.com/users/${user}/repos?per_page=100`)
    .then((res) => { return res.json(); })
    .then(async (data) => {
        data.sort((a, b) => new Date(b.pushed_at) - new Date(a.pushed_at));
        console.log(data);
            for (let i = 0; i < data.length; i++) {
                var ele = data[i];
                // console.log(ele);
                var name = ele.name;
                var description = ele.description;
                var repoLink = ele.html_url;
                var num = 0;
                var langs=ele.topics;
                var langsStr="";
                if(langs.length!==0){
                    if (langs.length > 8) {
                        num = 8;
                    }
                    else {
                        num = langs.length;
                    }
                    // console.log(num);
                    for (let j = 0; j < num; j++) {
                        const element = langs[j];
                        langsStr += `<div class="lang">${element}</div>`;
                    }
                }
                else langsStr = await getStr(name);
                // console.log(langsStr);
                var update = `<div class="repos"><div class="repo"><a href="${repoLink}" style="text-decoration: none; color: black;" target="_blank"><h2>${name}</h2></a><div class="bio">${description}</div><div class="languages">${langsStr}</div></div></div>`;
                document.getElementById("c2").innerHTML += update;
            }
        });
    };
    // apiCall();
    
    async function getStr(name) {
        var langsStr = "";
        await fetch(`https://api.github.com/repos/${user}/${name}/languages`)
        .then((res) => { return res.json(); })
        .then((data) => {
            langs = Object.keys(data);
            // console.log(langs.length);
            var num = 0;
            if (langs.length > 8) {
                num = 8;
            }
            else {
                num = langs.length;
            }
            // console.log(num);
            for (let j = 0; j < num; j++) {
                const element = langs[j];
                langsStr += `<div class="lang">${element}</div>`;
            }
        });
        // console.log(langsStr);
    return langsStr;
}

Promise.all([bioUpdate(), apiCall()]).then(() => {
    document.querySelector(".loading").classList.add("hidden");
    document.querySelector(".pageNumbers").classList.remove("hidden");
    const pageNumbers = document.querySelector(".pageNumbers");
    const paginationList = document.getElementById("c2");
    const listItems = paginationList.querySelectorAll(".repos");
    const prevButton = document.getElementById("prev");
    const prevmButton = document.getElementById("prevm");
    const nextButton = document.getElementById("next");
    const nextmButton = document.getElementById("nextm");
    var contentLimit = 10;
    function manage() {
        const btn = document.querySelector('#btn');  
        const sb = document.querySelector('#perpage'); 
        // console.log(sb.value);
        contentLimit=sb.value;  
        const pageCount = Math.ceil(listItems.length / contentLimit);
        let currentPage = 1;
    
        // console.log(listItems.length);
        // console.log(pageCount);
    
        const displayPageNumbers = (index) => {
            const pageNumber = document.createElement("a");
            pageNumber.innerText = index;
            pageNumber.setAttribute("href", "#");
            pageNumber.setAttribute("index", index);
            pageNumbers.appendChild(pageNumber);
        };
    
        const getPageNumbers = () => {
            document.querySelector(".pageNumbers").innerHTML="";
            for (let i = 1; i <= pageCount; i++) {
                displayPageNumbers(i);
            };
        };
        const disableButton = (button) => {
            button.classList.add("disabled");
            button.setAttribute("disabled", true);
        };
    
        const enableButton = (button) => {
            button.classList.remove("disabled");
            button.removeAttribute("disabled");
        };
    
        const controlButtonsStatus = () => {
            if (currentPage == 1) {
                disableButton(prevButton);
                disableButton(prevmButton);
            }
            else {
                enableButton(prevButton);
                enableButton(prevmButton);
            }
            if (pageCount == currentPage) {
                disableButton(nextButton);
                disableButton(nextmButton);
            }
            else {
                enableButton(nextButton);
                enableButton(nextmButton);
            }
        };
        
        const handleActivePageNumber = () => {
            document.querySelectorAll('.pageNumbers a').forEach((button) => {
                button.classList.remove("active");
                const pageIndex = Number(button.getAttribute("index"));
                if (pageIndex == currentPage) {
                    button.classList.add('active');
                }
            });
        };
        
        const setCurrentPage = (pageNum) => {
            currentPage = pageNum;
            
            handleActivePageNumber();
            controlButtonsStatus();
            
            const prevRange = (pageNum - 1) * contentLimit;
            const currRange = pageNum * contentLimit;
            
            listItems.forEach((item, index) => {
                item.classList.add('hidden');
                if (index >= prevRange && index < currRange) {
                    item.classList.remove('hidden');
                }
            });
        };
        getPageNumbers();
        setCurrentPage(1);
    
        prevButton.addEventListener('click', () => {
            setCurrentPage(currentPage - 1);
        });
        prevmButton.addEventListener('click', () => {
            setCurrentPage(currentPage - 1);
        });
    
        nextButton.addEventListener("click", () => {
            setCurrentPage(currentPage + 1);
        });
        nextmButton.addEventListener("click", () => {
            setCurrentPage(currentPage + 1);
        });
    
        document.querySelectorAll('.pageNumbers a').forEach((button) => {
            const pageIndex = Number(button.getAttribute('index'));
    
            if (pageIndex) {
                button.addEventListener('click', () => {
                    setCurrentPage(pageIndex);
                });
            };
        });
    } 
    manage();
    btn.onclick = () =>  
    {  
        manage();
    };  

    var sbtn = document.getElementById("sbtn");
		sbtn.onclick = e=>{
			const text = document.getElementById("search").value;
			// console.log(text);
            for (let i = 0; i < listItems.length; i++) {
                const ele=document.querySelectorAll(".repo h2")[i];
                const matchText=ele.innerHTML;
                console.log(matchText);
                console.log(text);
                if(text===""){
                    document.querySelectorAll(".repos")[i].classList.remove('hidden');
                }
                else if(text.toLowerCase()===matchText.toLowerCase()) {
                    document.querySelectorAll(".repos")[i].classList.remove('hidden');
                }
                else{
                    document.querySelectorAll(".repos")[i].classList.add('hidden');
                }
            }
		}
});
