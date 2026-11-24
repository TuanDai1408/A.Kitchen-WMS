function Kt(e){return e==null||isNaN(e)?"0 \u20AB":Math.round(e).toLocaleString("vi-VN")+" \u20AB"}function q(e){if(e==null||isNaN(e))return{val:"\u2014",unit:"",full:"\u2014"};let t=Number(e),n=Math.abs(t),o=t<0?"-":"",a=t.toLocaleString("vi-VN")+" \u20AB";if(n>=1e9){let i=(n/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:o+i,unit:"t\u1EF7 \u20AB",full:a}}else if(n>=1e6){let i=(n/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:o+i,unit:"tr \u20AB",full:a}}else return{val:o+n.toLocaleString("vi-VN"),unit:"\u20AB",full:a}}function Xt(e){if(!e)return"\u2014";if(typeof e=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e.trim()))return e.trim();try{let t=new Date(e);if(isNaN(t.getTime()))return String(e);let n=t.getFullYear(),o=String(t.getMonth()+1).padStart(2,"0"),a=String(t.getDate()).padStart(2,"0");return`${n}-${o}-${a}`}catch{return String(e)}}function Gt(e,t=1){return e==null||isNaN(e)?"0":Number(e).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:t})}function l(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function Yt(e,t=200){let n=null;return function(...o){n&&clearTimeout(n),n=setTimeout(()=>{e.apply(this,o)},t)}}var j=class{cache=new Map;defaultTtl=3e4;async get(t,n=this.defaultTtl){let o=Date.now(),a=this.cache.get(t);if(a&&o-a.timestamp<n)return o-a.timestamp>1e4&&fetch(t).then(i=>i.json()).then(i=>{i.success&&this.cache.set(t,{timestamp:Date.now(),data:i})}).catch(()=>{}),a.data;try{let r=await(await fetch(t)).json();return r.success&&this.cache.set(t,{timestamp:o,data:r}),r}catch(i){return{success:!1,error:i instanceof Error?i.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(t,n){this.cache.clear();try{return await(await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json()}catch(o){return{success:!1,error:o instanceof Error?o.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(t){if(!t){this.cache.clear();return}for(let n of this.cache.keys())n.includes(t)&&this.cache.delete(n)}async getPoList(t,n="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(t)}&status=${encodeURIComponent(n)}`)}async getPoDetails(t){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}`)}async getReceiptHistory(t){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(t)}`)}async getInventory(t){return this.get(`/api/wh/inventory?site=${encodeURIComponent(t)}`)}async submitManualReceipt(t){return this.post("/api/fnb/manual-receipt",t)}},zt=new j;function k(){let e=localStorage.getItem("orbit_user_site");if(e)return e.toUpperCase();let t=window,n=typeof t.App<"u"&&t.App.currentBranch?t.App.currentBranch.toUpperCase():"K001";return n==="ALL"||!n?"K001":n}function S(e){if(!e||e==="\u2014")return"\u2014";let t=String(e).trim(),n=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;try{let o=new Date(t);if(!isNaN(o.getTime())){let a=o.getFullYear(),i=String(o.getMonth()+1).padStart(2,"0"),r=String(o.getDate()).padStart(2,"0");return`${a}-${i}-${r}`}}catch{}return t.slice(0,10)}function L(e){if(!e)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let t=new Date;t.setHours(0,0,0,0);let n=new Date(e);n.setHours(0,0,0,0);let o=Math.ceil((n.getTime()-t.getTime())/(1e3*60*60*24));return o<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(o)} ng\xE0y)</span>`:o===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':o<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${o} ng\xE0y)</span>`:o<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${o} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${o} ng\xE0y</span>`}function $(e){window.gFnbReceiptCurrentView=e;let t=document.getElementById("fnbReceiptTabBtnPo"),n=document.getElementById("fnbReceiptTabBtnHistory"),o=document.getElementById("fnbPoListView"),a=document.getElementById("fnbReceiptHistoryView");e==="po"?(t&&(t.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),o&&o.classList.remove("hidden"),a&&a.classList.add("hidden"),T()):(n&&(n.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),t&&(t.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),a&&a.classList.remove("hidden"),o&&o.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function at(e){let t=e||k(),n=document.getElementById("fnbReceiptFilterSite");n&&(n.value=t);let a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(s=>s.code.toUpperCase()===t.toUpperCase()),i=a?a.ten||a.name:t,r=document.getElementById("fnbReceiptCurrentSiteBadge");r&&(r.textContent=i),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(t):await T(t)}function it(e){H(e)}async function T(e){let t=e||k(),n=document.getElementById("fnbPoStatusFilter"),o=n?n.value:"OPEN",a=document.getElementById("fnbPoSummaryText");try{a&&(a.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${t}...`);let r=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(t)}&status=${encodeURIComponent(o)}&no-cache=1`)).json();if(r.success&&r.data){window.gFnbPoList=r.data;let s=document.getElementById("fnbPoSearchInput")?.value||"";H(s);let d=(window.gFnbPoList||[]).filter(y=>y.status==="OPEN").length,c=document.getElementById("fnbReceiptBadgePendingCount");c&&(c.textContent=String(d))}else throw new Error(r.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(i){console.error("loadFnbPoList error:",i),a&&(a.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+i.message)}}function H(e=""){let t=document.getElementById("fnbPoTableBody"),n=document.getElementById("fnbPoMobileCards"),o=document.getElementById("fnbPoSummaryText"),a=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),i=(e||"").toLowerCase().trim(),r=window.gFnbPoList||[];a&&(r=r.filter(s=>{let d=(s.supplier_name||"").toLowerCase();return a==="siba"?d.includes("siba")||d.includes("b\u1EBFp trung t\xE2m")||d.includes("trung t\xE2m"):a==="baf"?d.includes("baf")||d.includes("th\u1ECBt"):a==="spice"?d.includes("gia v\u1ECB")||d.includes("\u0111\u01B0\u1EDDng")||d.includes("unilever")||d.includes("cholimex")||d.includes("mu\u1ED1i"):a==="veg"?d.includes("rau")||d.includes("\u0111\xE0 l\u1EA1t")||d.includes("c\u1EE7"):!0})),i&&(r=r.filter(s=>{let d=(s.po_number||"").toLowerCase(),c=(s.supplier_name||"").toLowerCase(),y=(s.supplier_code||"").toLowerCase();return d.includes(i)||c.includes(i)||y.includes(i)})),o&&(o.textContent=`Hi\u1EC3n th\u1ECB ${r.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),t&&(r.length===0?t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':t.innerHTML=r.map(s=>{let d=s.status==="OPEN",c=s.status==="COMPLETED",y=c?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',p=(s.po_number||"").startsWith("50000")||!s.supplier_code||s.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',m=Number(s.total_amount)||0,b=Number(s.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${l(s.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${l(S(s.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${p}
                <span class="font-medium text-gray-900 dark:text-white">${l(s.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${s.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${l(s.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${s.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${b.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${m>0?Math.round(m).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${y}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${l(s.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${c?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${c?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${c?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),n&&(r.length===0?n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':n.innerHTML=r.map(s=>{let d=s.status==="COMPLETED",c=(s.po_number||"").startsWith("50000")||!s.supplier_code||s.supplier_name==="B\u1EBFp Trung T\xE2m Siba",y=Number(s.total_amount)||0,h=Number(s.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${c?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${c?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${l(s.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${l(s.po_number)} \u2022 ${l(S(s.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${d?"text-emerald-600":"text-amber-600"} block">${d?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${s.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${h.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${y>0?Math.round(y).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${l(s.po_number)}')" class="w-full py-2 rounded-xl ${d?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${d?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${d?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function Q(e){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+e+"...");let n=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(e)}&no-cache=1`)).json();if(!n.success||!n.data)throw new Error(n.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let o=n.data;if(!o.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let a=o[0],i=document.getElementById("receiptModalInvoice"),r=document.getElementById("receiptModalInvoiceDisplay"),s=document.getElementById("receiptModalSite"),d=document.getElementById("receiptModalSiteDisplay"),c=document.getElementById("receiptModalSupplier"),y=document.getElementById("receiptModalSupplierDisplay"),h=document.getElementById("receiptModalDate"),p=new Date().toISOString().slice(0,10);i&&(i.value=a.po_number),r&&(r.textContent=a.po_number),s&&(s.value=a.site),d&&(d.textContent=a.site),c&&(c.value=a.supplier_name),y&&(y.textContent=a.supplier_name),h&&(h.value=p);let m="L\xD4-"+p.replace(/-/g,"").slice(2),b=new Date;b.setFullYear(b.getFullYear()+1);let u=b.toISOString().slice(0,10);window.gReceiptLines=o.map(w=>{let v=(w.merch_category||"").toLowerCase(),C=!v.includes("bao b\xEC")&&!v.includes("c\xF4ng c\u1EE5")&&!v.includes("h\xF3a ch\u1EA5t")&&!v.includes("t\u1EA1p ph\u1EA9m");return{po_item:w.po_item,item_code:w.item_code,item_name:w.item_name,merch_category:w.merch_category,unit:w.unit||"KG",unit_price:Number(w.unit_price)||0,order_qty:Number(w.order_qty)||0,actual_qty:Number(w.order_qty)||0,batch_code:m,exp_date:C?u:"",is_food:C,note:""}}),O();let f=document.getElementById("createReceiptModal");f&&f.classList.remove("hidden")}catch(t){console.error("openPoReceiptModal error:",t),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+t.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function O(){let e=document.getElementById("receiptLinesTableBody"),t=document.getElementById("receiptLinesMobileCards"),n=document.getElementById("receiptModalLineCount"),o=document.getElementById("receiptModalTotalAmount"),a=window.gReceiptLines||[];n&&(n.textContent=String(a.length));let i=0;e&&(e.innerHTML=a.map((r,s)=>{let d=(r.actual_qty||0)*(r.unit_price||0);return i+=d,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${s+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${l(r.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${l(r.item_code)}</span>
              ${r.merch_category?`<span>\u2022</span><span>${l(r.merch_category)}</span>`:""}
              ${r.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${l(r.unit||"")}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300">
            ${Number(r.unit_price).toLocaleString("vi-VN")} \u0111
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
            ${Number(r.order_qty).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" step="0.01" min="0" value="${r.actual_qty}" 
                   oninput="onReceiptLineQtyChange(${s}, this.value)" 
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="text" value="${l(r.batch_code||"")}" placeholder="L\xF4 SX..." 
                   oninput="onReceiptLineBatchChange(${s}, this.value)" 
                   class="w-28 text-center py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex flex-col items-center">
              <input type="date" id="receiptLineExpInput_${s}" value="${r.exp_date||""}" 
                     onchange="onReceiptLineExpChange(${s}, this.value)" 
                     class="w-32 py-1 px-1.5 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <div class="flex items-center gap-1 mt-1">
                <button type="button" onclick="setReceiptLineQuickExp(${s}, 1)" title="+1 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${s}, 6)" title="+6 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${s}, 12)" title="+1 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${s}, 24)" title="+2 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+2N</button>
              </div>
              <div id="receiptExpWarning_${s}" class="mt-1">
                ${L(r.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${s}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${d>0?Math.round(d).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${l(r.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${s}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),t&&(t.innerHTML=a.map((r,s)=>{let d=(r.actual_qty||0)*(r.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${l(r.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${l(r.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${l(r.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(r.unit_price).toLocaleString("vi-VN")} \u0111</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">#${s+1}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl text-center tabular-nums text-xs">
            <div>
              <span class="text-gray-400 block text-[11px]">SL \u0110\u1EB7t SAP:</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">${Number(r.order_qty).toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Th\xE0nh ti\u1EC1n:</span>
              <span id="receiptLineTotalMob_${s}" class="num font-bold text-brand-600 dark:text-brand-400">${d>0?Math.round(d).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Ph\xE2n lo\u1EA1i:</span>
              <span class="text-xs font-medium">${r.is_food?"Th\u1EF1c ph\u1EA9m":"V\u1EADt t\u01B0"}</span>
            </div>
          </div>

          <div class="space-y-2 pt-1 text-xs">
            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">SL th\u1EF1c nh\u1EADp:</label>
              <input type="number" step="0.01" min="0" value="${r.actual_qty}" 
                     oninput="onReceiptLineQtyChange(${s}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center">
            </div>

            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">S\u1ED1 l\xF4 (Batch):</label>
              <input type="text" value="${l(r.batch_code||"")}" placeholder="L\xF4 SX..." 
                     oninput="onReceiptLineBatchChange(${s}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">H\u1EA1n d\xF9ng (EXP):</label>
                <input type="date" id="receiptLineExpInputMob_${s}" value="${r.exp_date||""}" 
                       onchange="onReceiptLineExpChange(${s}, this.value)" 
                       class="flex-1 py-1 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 outline-none">
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <span class="text-[11px] text-gray-400">Ch\u1ECDn nhanh:</span>
                <button type="button" onclick="setReceiptLineQuickExp(${s}, 1)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${s}, 6)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${s}, 12)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${s}, 24)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+2N</button>
              </div>
              <div id="receiptExpWarningMob_${s}" class="mt-1">
                ${L(r.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${l(r.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${s}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),o&&(o.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function st(e,t){if(!window.gReceiptLines||!window.gReceiptLines[e])return;let n=parseFloat(t);window.gReceiptLines[e].actual_qty=isNaN(n)?0:n;let o=window.gReceiptLines[e],a=(o.actual_qty||0)*(o.unit_price||0),i=document.getElementById(`receiptLineTotal_${e}`);i&&(i.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let r=document.getElementById(`receiptLineTotalMob_${e}`);r&&(r.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let s=0;window.gReceiptLines.forEach(c=>{s+=(c.actual_qty||0)*(c.unit_price||0)});let d=document.getElementById("receiptModalTotalAmount");d&&(d.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function rt(e,t){!window.gReceiptLines||!window.gReceiptLines[e]||(window.gReceiptLines[e].batch_code=t)}function dt(e,t){if(!window.gReceiptLines||!window.gReceiptLines[e])return;window.gReceiptLines[e].exp_date=t;let n=document.getElementById(`receiptExpWarning_${e}`);n&&(n.innerHTML=L(t));let o=document.getElementById(`receiptExpWarningMob_${e}`);o&&(o.innerHTML=L(t)),window.lucide&&window.lucide.createIcons()}function lt(e,t){if(!window.gReceiptLines||!window.gReceiptLines[e])return;let n=new Date;n.setMonth(n.getMonth()+t);let o=n.toISOString().slice(0,10);window.gReceiptLines[e].exp_date=o;let a=document.getElementById(`receiptLineExpInput_${e}`);a&&(a.value=o);let i=document.getElementById(`receiptLineExpInputMob_${e}`);i&&(i.value=o);let r=document.getElementById(`receiptExpWarning_${e}`);r&&(r.innerHTML=L(o));let s=document.getElementById(`receiptExpWarningMob_${e}`);s&&(s.innerHTML=L(o)),window.lucide&&window.lucide.createIcons()}function ct(e,t){!window.gReceiptLines||!window.gReceiptLines[e]||(window.gReceiptLines[e].note=t)}function U(){let e=document.getElementById("createReceiptModal");e&&e.classList.add("hidden")}function ut(){window.gFnbPoList&&window.gFnbPoList.length?Q(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function pt(){let t=(window.gReceiptLines||[]).filter(p=>(p.actual_qty||0)>0);if(!t.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let n=new Date;n.setHours(0,0,0,0);let o=!1;for(let p of t)if(p.exp_date){let m=new Date(p.exp_date);if(m.setHours(0,0,0,0),m<=n){o=!0;break}}if(o&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let a=document.getElementById("receiptModalSite")?.value||k(),i=document.getElementById("receiptModalInvoice")?.value||"",r=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),s=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",d=document.getElementById("receiptModalNotes")?.value||"",c=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",y={site_code:a,receipt_date:r,supplier:s,invoice_no:i,notes:d,created_by:c,lines:t.map(p=>({item_code:p.item_code,qty:p.actual_qty,unit_price:p.unit_price,batch_code:(p.batch_code||"").trim(),exp_date:(p.exp_date||"").trim()||null,note:p.note||""}))},h=document.getElementById("btnSubmitReceipt");h&&(h.disabled=!0,h.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let m=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(y)})).json();if(!m.success)throw new Error(m.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${m.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${a} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),U(),await T(a),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(a),$("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(p){console.error("submitCreateReceipt error:",p),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+p.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),h&&(h.disabled=!1,h.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function gt(e){let t=e||k(),n=document.getElementById("fnbReceiptsTableBody"),o=document.getElementById("fnbReceiptsMobileCards");try{let i=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();if(i.success&&i.data){let r=i.data.receipts||[],s=document.getElementById("fnbReceiptBadgeHistoryCount");s&&(s.textContent=String(r.length)),n&&(r.length?n.innerHTML=r.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${l(d.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${l(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${l(S(d.receipt_date))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${l(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</td>
              <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${l(d.invoice_no||"\u2014")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-3 px-3 text-gray-500 text-xs">${l(d.created_by||"Th\u1EE7 kho")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewReceiptDetail(${d.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):n.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${l(t)}.</td></tr>`),o&&(r.length?o.innerHTML=r.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${l(d.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${l(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${l(S(d.receipt_date))} \u2022 PO: ${l(d.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${l(d.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(a){console.error("loadFnbReceiptsHistory error:",a)}}async function mt(e){try{typeof window.showLoading=="function"&&window.showLoading();let n=await(await fetch(`/api/fnb/receipts?id=${e}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let o=n.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${e}`),r&&(r.textContent=`${o.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let s=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-2 text-center">\u0110VT</th>
              <th class="py-2 px-3 text-right">SL Nh\u1EADp</th>
              <th class="py-2 px-3 text-center whitespace-nowrap min-w-[100px]">M\xE3 L\xF4 SX</th>
              <th class="py-2 px-3 text-center whitespace-nowrap min-w-[110px]">H\u1EA1n D\xF9ng (EXP)</th>
              <th class="py-2 px-3 text-right">\u0110\u01A1n Gi\xE1</th>
              <th class="py-2 px-3 text-right">Th\xE0nh Ti\u1EC1n</th>
              <th class="py-2 px-3">Ghi Ch\xFA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${o.map(c=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${l(c.item_name||c.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${l(c.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(c.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${l(c.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${c.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${l(c.exp_date?String(c.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(c.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(c.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${l(c.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=s),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(t){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+t.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function bt(e){let t=e||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||k()||"K001",o=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(f=>f.code.toUpperCase()===t.toUpperCase()),a=o?o.ten||o.name:t,i=a.startsWith(t)?a:`${t} - ${a}`,r=document.getElementById("manualReceiptSiteNameDisplay");r&&(r.textContent=i);let s=document.getElementById("manualReceiptSiteSelect");s&&(s.value=t);let d=document.getElementById("manualReceiptSiteBadge");d&&(d.textContent=t);let c=document.getElementById("manualReceiptDate");c&&(c.value=new Date().toISOString().slice(0,10));let y=document.getElementById("manualReceiptSupplier");y&&!y.value&&(y.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let h=document.getElementById("manualReceiptInvoiceNo");h&&(h.value="");let p=document.getElementById("manualReceiptNotes");p&&(p.value="");let m=document.getElementById("manualItemSearchInput");m&&(m.value="");let b=document.getElementById("manualItemCategorySelect");b&&(b.value=""),window.gManualReceiptLines=[],_();let u=document.getElementById("modalManualReceipt");u&&u.classList.remove("hidden"),await N(t,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function K(){let e=document.getElementById("modalManualReceipt");e&&e.classList.add("hidden")}async function yt(e){let t=document.getElementById("manualReceiptSiteBadge");t&&(t.textContent=e),await N(e,window.gManualShowAllCatalog)}async function xt(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let e=document.getElementById("txtToggleManualCatalog");e&&(e.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let t=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await N(t,window.gManualShowAllCatalog)}async function N(e,t){let n=document.getElementById("manualCatalogListContainer");n&&(n.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let o=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(e)}${t?"&include_all=1":""}`,i=await(await fetch(o)).json();i.success&&i.data?window.gManualSiteCatalog=i.data.items||[]:window.gManualSiteCatalog=[],I()}catch(o){console.error("loadManualCatalogItems error:",o),n&&(n.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${l(o.message)}</div>`)}}function I(){let e=document.getElementById("manualCatalogListContainer"),t=document.getElementById("manualCatalogCountText"),n=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),o=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),a=window.gManualSiteCatalog||[];if(n&&(a=a.filter(i=>{let r=(i.code||i.sku||"").toLowerCase(),s=(i.name||"").toLowerCase();return r.includes(n)||s.includes(n)})),o&&(a=a.filter(i=>(i.nhom_hang||i.item_group||i.nganh_hang||"").toLowerCase().includes(o))),t&&(t.textContent=String(a.length)),!!e){if(!a.length){e.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${n?`v\u1EDBi t\u1EEB kh\xF3a "${l(n)}"`:""}.
      </div>
    `;return}e.innerHTML=a.map(i=>{let r=i.code||i.sku,s=(window.gManualReceiptLines||[]).find(y=>y.item_code===r),d=parseFloat(i.book_qty||0),c=parseFloat(i.unit_price||0);return`
      <div onclick="addManualReceiptItem('${r}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${s?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${l(i.name||r)}">
              ${l(i.name||r)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${l(i.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${l(r)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${d>0?"text-emerald-600":"text-gray-500"} font-mono">${d.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${c>0?Math.round(c).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
          </div>
        </div>
        <div>
          ${s?`
            <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs font-mono">
              <i data-lucide="check" class="w-3 h-3"></i> x${s.qty}
            </span>
          `:`
            <button type="button" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors">
              <i data-lucide="plus" class="w-3 h-3"></i> Th\xEAm
            </button>
          `}
        </div>
      </div>
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function ht(e){let t=(window.gManualSiteCatalog||[]).find(o=>(o.code||o.sku)===e);if(!t)return;let n=(window.gManualReceiptLines||[]).find(o=>o.item_code===e);if(n)n.qty=Math.round((n.qty+1)*100)/100;else{let a="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),i=new Date;i.setFullYear(i.getFullYear()+1);let r=i.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:t.code||t.sku,item_name:t.name||t.code,unit:t.unit||"Ph\u1EA7n",unit_price:parseFloat(t.unit_price||0),qty:1,batch_code:a,exp_date:r,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}_(),I()}function _(){let e=document.getElementById("manualLinesEmptyState"),t=document.getElementById("manualLinesTableWrapper"),n=document.getElementById("manualLinesMobileCards"),o=document.getElementById("btnClearAllManualLines"),a=document.getElementById("manualLinesTableBody"),i=document.getElementById("manualSelectedCountText"),r=document.getElementById("manualSummaryTotalSkus"),s=document.getElementById("manualSummaryTotalQty"),d=document.getElementById("manualSummaryTotalAmount"),c=window.gManualReceiptLines||[];if(i&&(i.textContent=String(c.length)),r&&(r.textContent=c.length+" m\xE3"),!c.length){e&&e.classList.remove("hidden"),t&&(t.classList.add("hidden"),t.classList.remove("lg:block")),n&&(n.classList.add("hidden"),n.classList.remove("block")),o&&(o.classList.add("hidden"),o.classList.remove("flex")),s&&(s.textContent="0"),d&&(d.textContent="0 \u0111");return}e&&e.classList.add("hidden"),t&&(t.classList.remove("hidden"),t.classList.add("lg:block")),n&&(n.classList.remove("hidden"),n.classList.add("block")),o&&(o.classList.remove("hidden"),o.classList.add("flex"));let y=0,h=0;a&&(a.innerHTML=c.map((p,m)=>{let b=(p.qty||0)*(p.unit_price||0);return y+=p.qty||0,h+=b,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${m+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${l(p.item_name)}">
              ${l(p.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${l(p.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${l(p.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${p.qty}" 
                   oninput="onManualLineQtyChange(${m}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${p.unit_price}" 
                   oninput="onManualLinePriceChange(${m}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${m}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${b>0?Math.round(b).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${l(p.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${m}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${p.exp_date||""}" 
                   onchange="onManualLineExpChange(${m}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${l(p.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${m}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${m})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=c.map((p,m)=>{let b=(p.qty||0)*(p.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${m+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${l(p.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${l(p.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${m})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${l(p.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${p.qty}" 
                     oninput="onManualLineQtyChange(${m}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${p.unit_price}" 
                     oninput="onManualLinePriceChange(${m}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${b>0?Math.round(b).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${l(p.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${m}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${p.exp_date||""}" 
                   onchange="onManualLineExpChange(${m}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),s&&(s.textContent=y>0?Number.isInteger(y)?String(y):y.toFixed(1):"0"),d&&(d.textContent=h>0?Math.round(h).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function ft(e,t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let n=parseFloat(t);window.gManualReceiptLines[e].qty=isNaN(n)?0:n,F()}function wt(e,t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let n=parseFloat(t);window.gManualReceiptLines[e].unit_price=isNaN(n)?0:n,F()}function F(){let e=0,t=0;(window.gManualReceiptLines||[]).forEach((a,i)=>{let r=(a.qty||0)*(a.unit_price||0);e+=a.qty||0,t+=r;let s=document.getElementById(`manualLineTotal_${i}`);s&&(s.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let n=document.getElementById("manualSummaryTotalQty"),o=document.getElementById("manualSummaryTotalAmount");n&&(n.textContent=e.toFixed(1)),o&&(o.textContent=Math.round(t).toLocaleString("vi-VN")+" \u0111")}function vt(e,t){!window.gManualReceiptLines||!window.gManualReceiptLines[e]||(window.gManualReceiptLines[e].batch_code=t)}function Lt(e,t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;window.gManualReceiptLines[e].exp_date=t;let n=document.getElementById(`manualLineExpWarning_${e}`);n&&(n.innerHTML=L(t),window.lucide&&window.lucide.createIcons())}function kt(e,t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let n=new Date;n.setMonth(n.getMonth()+t);let o=n.toISOString().slice(0,10);window.gManualReceiptLines[e].exp_date=o;let a=document.getElementById(`manualLineExpInput_${e}`);a&&(a.value=o);let i=document.getElementById(`manualLineExpWarning_${e}`);i&&(i.innerHTML=L(o),window.lucide&&window.lucide.createIcons())}function Mt(e,t){!window.gManualReceiptLines||!window.gManualReceiptLines[e]||(window.gManualReceiptLines[e].storage_loc=t)}function X(e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let t=window.gManualReceiptLines[e];window.gManualReceiptLines.splice(e,1),_(),typeof I=="function"&&I(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(t.item_name||t.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function G(){let e=window.gManualReceiptLines||[];if(!e.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let t=document.getElementById("confirmClearManualCountText");t&&(t.textContent=String(e.length));let n=document.getElementById("modalConfirmClearManualLines");n&&(n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function Y(){let e=document.getElementById("modalConfirmClearManualLines");e&&e.classList.add("hidden")}function St(){let e=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],Y(),_(),I(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${e} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function Tt(){let t=(window.gManualReceiptLines||[]).filter(b=>(b.qty||0)>0);if(!t.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let n=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!n){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let o=new Date;o.setHours(0,0,0,0);let a=!1;for(let b of t)if(b.exp_date){let u=new Date(b.exp_date);if(u.setHours(0,0,0,0),u<=o){a=!0;break}}if(a&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let i=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",r=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),s=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",d=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",c=(document.getElementById("manualReceiptNotes")?.value||"").trim(),y=`[${s}] ${c}`.trim(),h=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",p={site_code:i,receipt_date:r,supplier:n,invoice_no:d,notes:y,created_by:h,lines:t.map(b=>({item_code:b.item_code,qty:b.qty,unit_price:b.unit_price,batch_code:(b.batch_code||"").trim(),exp_date:(b.exp_date||"").trim()||null,storage_loc:b.storage_loc||"K\u1EC7 B\u1EBFp",note:b.note||""}))},m=document.getElementById("btnSubmitManualReceipt");m&&(m.disabled=!0,m.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let u=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)})).json();if(!u.success)throw new Error(u.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${u.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${i} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),K(),await T(i),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(i),$("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(b){console.error("submitManualReceipt error:",b),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+b.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),m&&(m.disabled=!1,m.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var g=window;g.gFnbReceiptCurrentView=g.gFnbReceiptCurrentView||"po";g.gFnbPoList=g.gFnbPoList||[];g.gReceiptLines=g.gReceiptLines||[];g.gManualReceiptLines=g.gManualReceiptLines||[];g.gManualSiteCatalog=g.gManualSiteCatalog||[];g.gManualShowAllCatalog=g.gManualShowAllCatalog||!1;g.getActiveFnbReceiptSite=k;g.formatReceiptDateYMD=S;g.getReceiptExpWarningHtml=L;g.switchFnbReceiptSubView=$;g.loadFnbReceipts=at;g.onFnbPoSearchInput=it;g.loadFnbPoList=T;g.renderFnbPoTable=H;g.openPoReceiptModal=Q;g.renderReceiptLinesTable=O;g.onReceiptLineQtyChange=st;g.onReceiptLineBatchChange=rt;g.onReceiptLineExpChange=dt;g.setReceiptLineQuickExp=lt;g.onReceiptLineNoteChange=ct;g.closeCreateReceiptModal=U;g.openCreateReceiptModal=ut;g.submitCreateReceipt=pt;g.loadFnbReceiptsHistory=gt;g.viewReceiptDetail=mt;g.openManualReceiptModal=bt;g.closeManualReceiptModal=K;g.onManualReceiptSiteChange=yt;g.toggleManualShowAllCatalog=xt;g.loadManualCatalogItems=N;g.filterManualCatalogList=I;g.addManualReceiptItem=ht;g.renderManualReceiptLinesTable=_;g.onManualLineQtyChange=ft;g.onManualLinePriceChange=wt;g.updateManualTotals=F;g.onManualLineBatchChange=vt;g.onManualLineExpChange=Lt;g.setManualLineQuickExp=kt;g.onManualLineLocChange=Mt;g.removeManualReceiptLine=X;g.removeManualLine=X;g.confirmClearAllManualReceiptLines=G;g.clearAllManualReceiptLines=G;g.closeConfirmClearManualLinesModal=Y;g.executeClearAllManualReceiptLines=St;g.submitManualReceipt=Tt;function M(){let e=document.getElementById("globalBranchSelect")?.value,t=localStorage.getItem("orbit_user_site"),n=window,o=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():null,a=document.getElementById("fnbWasteFilterSite")?.value,i=e||t||o||a||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function J(){let e=document.getElementById("fnbWasteFilterSite");if(!e)return;let t=e.value||M(),n=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(o=>o.code!=="ALL");if(n&&n.length){let o="";n.forEach(a=>{o+=`<option value="${a.code}" ${a.code.toUpperCase()===t.toUpperCase()?"selected":""}>${a.name}</option>`}),e.innerHTML=o,t&&Array.from(e.options).some(a=>a.value===t)&&(e.value=t)}}function R(e){let t=document.getElementById("subtab-fnb-waste-stock"),n=document.getElementById("subtab-fnb-waste-history"),o=document.getElementById("fnbWasteSubViewStock"),a=document.getElementById("fnbWasteSubViewHistory");e==="history"?(t&&(t.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),o&&o.classList.add("hidden"),a&&a.classList.remove("hidden")):(t&&(t.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),o&&o.classList.remove("hidden"),a&&a.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function z(e){let t=e||M(),n=document.getElementById("fnbWasteTableBody"),o=document.getElementById("fnbWasteMobileCards"),a=document.getElementById("fnbWasteBadgeHistoryCount");try{let r=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();if(r.success&&r.data){let s=r.data.wastes||[];a&&(a.textContent=String(s.length)),n&&(s.length?n.innerHTML=s.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${l(d.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${l(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${l(String(d.waste_date||"").slice(0,10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${l(d.reason||"H\xE0ng h\u1ECFng")}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${l(d.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u20AB</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${l(d.notes||"\u2014")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${d.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi ti\u1EBFt">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):n.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${l(t)}.</td></tr>`),o&&(s.length?o.innerHTML=s.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${l(d.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${l(d.reason||"H\xE0ng h\u1ECFng")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y: ${l(String(d.waste_date||"").slice(0,10))} \u2022 \u0110i\u1EC3m: ${l(d.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u20AB</span>
                  <span class="text-xs text-gray-400">${l(d.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</span>
                </div>
              </div>
            </div>
          `).join(""):o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(i){console.error("loadFnbWasteHistory error:",i)}}async function Ct(e){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let n=await(await fetch(`/api/fnb/wastes?id=${e}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let o=n.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${e}`),r&&(r.textContent=`${o.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let s=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-2 text-center">\u0110VT</th>
              <th class="py-2 px-3 text-right">SL H\u1EE7y</th>
              <th class="py-2 px-3 text-right">\u0110\u01A1n Gi\xE1</th>
              <th class="py-2 px-3 text-right">Th\xE0nh Ti\u1EC1n</th>
              <th class="py-2 px-3">L\xFD Do Chi Ti\u1EBFt</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${o.map(c=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${l(c.item_name||c.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${l(c.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${l(c.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(c.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(c.unit_price).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(c.amount).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${l(c.reason_detail||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=s),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(t){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+t.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Z(){let e=document.getElementById("fnbWasteNganhHangFilter"),t=document.getElementById("fnbWasteNhomHangFilter");if(!e||!t)return;let n=new Map;(window.gFnbWasteStockItems||[]).forEach(a=>{let i=(a.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),r=(a.nhom_hang||a.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();n.has(i)||n.set(i,new Set),n.get(i).add(r)}),window.gFnbWasteNganhMap=n;let o='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(n.keys()).sort().forEach(a=>{o+=`<option value="${l(a)}">${l(a)}</option>`}),e.innerHTML=o,e.value="",W("")}function W(e){let t=document.getElementById("fnbWasteNhomHangFilter");if(!t)return;let n=new Set;window.gFnbWasteNganhMap&&(e&&window.gFnbWasteNganhMap.has(e)?window.gFnbWasteNganhMap.get(e).forEach(a=>n.add(a)):window.gFnbWasteNganhMap.forEach(a=>a.forEach(i=>n.add(i))));let o='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(n).sort().forEach(a=>{o+=`<option value="${l(a)}">${l(a)}</option>`}),t.innerHTML=o,t.value=""}function Et(){let e=document.getElementById("fnbWasteNganhHangFilter")?.value||"";W(e),B()}function It(){B()}function $t(e){B()}function _t(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function B(){let e=document.getElementById("fnbWasteStockTableBody"),t=document.getElementById("fnbWasteStockMobileCards"),n=document.getElementById("fnbWasteStockEmptyState"),o=document.getElementById("fnbWasteSummary"),a=document.getElementById("fnbWasteBadgeInStockCount"),i=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),r=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),s=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),d=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),c=window.gFnbWasteStockItems||[],y=document.getElementById("kpiWasteInStockCount"),h=document.getElementById("kpiWasteInStockVal");y&&(y.textContent=String(c.length));let p=0;if(c.forEach(u=>{p+=Number(u.total_value)||Number(u.book_qty)*Number(u.unit_price)||0}),h){let u=q(p);h.innerHTML=`${u.val}<span class="kpi-unit">${u.unit}</span>`}a&&(a.textContent=String(c.length));let m=c.filter(u=>{if(s==="EXP"&&(u.days_remaining!==void 0?Number(u.days_remaining):999)>15&&!u.is_expired||i&&(u.nganh_hang||"").trim().toLowerCase()!==i||r&&(u.nhom_hang||u.item_group||"").trim().toLowerCase()!==r)return!1;if(d){let f=(u.name||"").toLowerCase(),w=(u.code||"").toLowerCase();if(!f.includes(d)&&!w.includes(d))return!1}return!0});if(o&&(o.textContent=`Hi\u1EC3n th\u1ECB ${m.length} / ${c.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),P(),!m.length){e&&(e.innerHTML=""),t&&(t.innerHTML=""),n&&n.classList.remove("hidden");return}n&&n.classList.add("hidden");let b=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];e&&(e.innerHTML=m.map((u,f)=>{let w=Number(u.book_qty)||0,v=Number(u.unit_price)||0,C=Number(u.total_value)||w*v,E=u.wasteQty||0,ot=E*v;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${f+1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${l(u.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${l(u.name||u.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${l(u.nganh_hang||u.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
              ${u.nhom_hang&&u.nhom_hang!==u.nganh_hang?`<span>\u2022</span><span>${l(u.nhom_hang)}</span>`:""}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${l(u.unit||"Ph\u1EA7n")}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(v).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${w.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(C).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${w}" value="${E>0?E:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${l(u.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${l(u.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${b.map(V=>`<option value="${l(V)}" ${u.wasteReason===V?"selected":""}>${l(V)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${l(u.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${ot>0?Math.round(ot).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${l(u.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${l(u.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),t&&(t.innerHTML=m.map(u=>{let f=Number(u.book_qty)||0,w=Number(u.unit_price)||0,v=u.wasteQty||0,C=v*w;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${l(u.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${l(u.name||u.code)}</h4>
              <div class="text-xs text-gray-400">${l(u.nganh_hang||u.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${f.toFixed(1)} ${l(u.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(w).toLocaleString("vi-VN")} \u20AB / ${l(u.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${f.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${f}" value="${v>0?v:""}" placeholder="0"
                     oninput="onWasteLineQtyChange('${l(u.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Th\xE0nh Ti\u1EC1n H\u1EE7y</label>
              <div id="mobWasteLineTotal_${l(u.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${C>0?Math.round(C).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">L\xFD Do H\u1EE7y</label>
            <select onchange="onWasteLineReasonChange('${l(u.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${b.map(E=>`<option value="${l(E)}" ${u.wasteReason===E?"selected":""}>${l(E)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function Rt(e,t){let n=(window.gFnbWasteStockItems||[]).find(d=>d.code===e);if(!n)return;let o=parseFloat(t),a=Number(n.book_qty)||0;isNaN(o)||o<0?n.wasteQty=0:o>a?(n.wasteQty=a,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${a})`)):n.wasteQty=o;let i=n.wasteQty*(Number(n.unit_price)||0),r=document.getElementById(`wasteLineTotal_${e}`);r&&(r.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let s=document.getElementById(`mobWasteLineTotal_${e}`);s&&(s.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),P()}function Bt(e,t){let n=(window.gFnbWasteStockItems||[]).find(o=>o.code===e);n&&(n.wasteReason=t)}function Nt(e,t){let n=(window.gFnbWasteStockItems||[]).find(o=>o.code===e);n&&(n.wasteNote=t)}function P(){let e=window.gFnbWasteStockItems||[],t=0,n=0;e.forEach(s=>{s.wasteQty>0&&(t++,n+=s.wasteQty*(Number(s.unit_price)||0))});let o=document.getElementById("kpiWasteSelectedCount");o&&(o.textContent=String(t));let a=document.getElementById("kpiWasteTotalEstAmount");if(a)if(n>0){let s=q(n);a.innerHTML=`${s.val}<span class="kpi-unit">${s.unit}</span>`}else a.textContent="0 \u20AB";let i=document.getElementById("btnSubmitDirectWaste"),r=document.getElementById("btnSubmitDirectWasteText");i&&(i.disabled=t===0),r&&(r.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${t})`)}async function Ht(){let t=(window.gFnbWasteStockItems||[]).filter(d=>(d.wasteQty||0)>0);if(!t.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let n=M(),o=new Date().toISOString().slice(0,10),a=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",i=0;t.forEach(d=>{i+=d.wasteQty*(Number(d.unit_price)||0)});let r={site_code:n,waste_date:o,reason:t.length===1?t[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:a,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${t.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:a,lines:t.map(d=>({item_code:d.code,qty:d.wasteQty,unit_price:Number(d.unit_price)||0,reason_detail:d.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:d.wasteNote||""}))},s=document.getElementById("btnSubmitDirectWaste");s&&(s.disabled=!0,s.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let c=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(!c.success)throw new Error(c.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${c.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${n} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),R("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(d){console.error("submitDirectWaste error:",d),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+d.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),s&&(s.disabled=!1,s.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function Ft(){let e=document.getElementById("createWasteModal"),t=M(),n=document.getElementById("wasteModalSite"),o=document.getElementById("wasteModalDate");if(o&&!o.value&&(o.value=new Date().toISOString().slice(0,10)),n){let i="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(r=>{i+=`<option value="${r.code}" ${r.code===t?"selected":""}>${r.ten||r.name}</option>`}),n.innerHTML=i,n.value=t}await D(t);let a=document.getElementById("wasteLinesContainer");a&&(a.innerHTML=""),A(),e&&e.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function tt(){let e=document.getElementById("createWasteModal");e&&e.classList.add("hidden")}async function Wt(){let e=document.getElementById("wasteModalSite")?.value||"K001";await D(e);let t=document.getElementById("wasteLinesContainer");t&&(t.innerHTML=""),A()}async function D(e){try{let n=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(e)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=n.success&&n.data?n.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function A(){let e=document.getElementById("wasteLinesContainer");if(!e)return;let t=window.gWasteModalInStockItems||[],n="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),o='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';t.forEach(i=>{o+=`<option value="${l(i.code)}" data-price="${i.unit_price}" data-unit="${l(i.unit||"")}" data-stock="${i.book_qty}">[${l(i.code)}] ${l(i.name)} (T\u1ED3n: ${Number(i.book_qty).toFixed(1)} ${l(i.unit||"")})</option>`});let a=`
    <div id="${n}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${n}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${o}
        </select>
        <button type="button" onclick="document.getElementById('${n}')?.remove(); recalculateWasteModalTotal();" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">SL H\u1EE7y</label>
          <input type="number" step="0.01" min="0" placeholder="0" oninput="onWasteModalLineQtyInput('${n}', this.value)" class="waste-modal-qty w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold tabular-nums text-center outline-none focus:border-rose-500 font-mono">
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">\u0110\u01A1n Gi\xE1</label>
          <div class="waste-modal-price py-1 px-2 text-xs tabular-nums text-gray-600 dark:text-gray-300 font-mono">0 \u20AB</div>
        </div>
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">Th\xE0nh Ti\u1EC1n</label>
          <div class="waste-modal-amt py-1 px-2 text-xs font-bold tabular-nums text-rose-600 text-right font-mono">0 \u20AB</div>
        </div>
      </div>
    </div>
  `;e.insertAdjacentHTML("beforeend",a),window.lucide&&window.lucide.createIcons()}function Pt(e,t){let n=document.getElementById(e);if(!n)return;let o=t.options[t.selectedIndex],a=Number(o?.getAttribute("data-price"))||0,i=Number(o?.getAttribute("data-stock"))||0,r=n.querySelector(".waste-modal-price");r&&(r.textContent=Math.round(a).toLocaleString("vi-VN")+" \u20AB");let s=n.querySelector(".waste-modal-qty");s&&(s.max=String(i),s.placeholder=`T\u1ED1i \u0111a ${i.toFixed(1)}`),et(e,s?s.value:"0")}function et(e,t){let n=document.getElementById(e);if(!n)return;let o=n.querySelector("select"),a=o?.options[o.selectedIndex],i=Number(a?.getAttribute("data-price"))||0,s=(parseFloat(t)||0)*i,d=n.querySelector(".waste-modal-amt");d&&(d.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),nt()}function nt(){let e=document.getElementById("wasteLinesContainer");if(!e)return;let t=0;e.querySelectorAll(".p-3").forEach(o=>{let a=o.querySelector("select"),i=a?.options[a.selectedIndex],r=Number(i?.getAttribute("data-price"))||0,s=o.querySelector(".waste-modal-qty"),d=parseFloat(s?.value||"0")||0;t+=d*r});let n=document.getElementById("wasteModalTotalAmount");n&&(n.textContent=t>0?Math.round(t).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function Dt(){let e=document.getElementById("wasteLinesContainer");if(!e)return;let t=[];if(e.querySelectorAll(".p-3").forEach(y=>{let h=y.querySelector("select"),p=h?.value,m=h?.options[h.selectedIndex],b=Number(m?.getAttribute("data-price"))||0,u=y.querySelector(".waste-modal-qty"),f=parseFloat(u?.value||"0")||0;p&&f>0&&t.push({item_code:p,qty:f,unit_price:b,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!t.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let n=document.getElementById("wasteModalSite")?.value||M(),o=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),a=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",i=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",r=document.getElementById("wasteModalNotes")?.value||"",s=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",d={site_code:n,waste_date:o,reason:a,confirmed_by:i,notes:r,created_by:s,lines:t},c=document.getElementById("btnSubmitWaste");c&&(c.disabled=!0,c.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let h=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)})).json();if(!h.success)throw new Error(h.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${h.data.waste_code}!`),tt(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),R("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(y){console.error("submitCreateWaste error:",y),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+y.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),c&&(c.disabled=!1,c.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function At(){J();let e=M(),t=document.getElementById("fnbWasteFilterSite");t&&t.value!==e&&(t.value=e);let n=document.getElementById("fnbWasteSummary");n&&(n.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+e+"...");try{let a=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(e)}&in_stock_only=1&no-cache=1`)).json();a.success&&a.data?window.gFnbWasteStockItems=(a.data.items||[]).map(i=>({...i,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],Z(),B(),z(e)}catch(o){console.error("loadFnbWaste error:",o),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+o.message)}}var x=window;x.gFnbWasteStockItems=x.gFnbWasteStockItems||[];x.gFnbWasteNganhMap=x.gFnbWasteNganhMap||null;x.gWasteModalInStockItems=x.gWasteModalInStockItems||[];x.getActiveFnbWasteSite=M;x.populateFnbWasteSiteDropdown=J;x.loadFnbWaste=At;x.switchFnbWasteSubView=R;x.populateFnbWasteFilters=Z;x.populateFnbWasteNhomHangDropdown=W;x.onFnbWasteNganhHangChange=Et;x.onFnbWasteFilterChange=It;x.onFnbWasteSearch=$t;x.onFnbWasteSiteChange=_t;x.renderFnbWasteStockTable=B;x.onWasteLineQtyChange=Rt;x.onWasteLineReasonChange=Bt;x.onWasteLineNoteChange=Nt;x.updateWasteKPIs=P;x.submitDirectWaste=Ht;x.loadFnbWasteHistory=z;x.viewWasteDetail=Ct;x.openCreateWasteModal=Ft;x.closeCreateWasteModal=tt;x.onWasteModalSiteChange=Wt;x.loadWasteModalItems=D;x.addWasteLineRow=A;x.onWasteModalItemSelect=Pt;x.onWasteModalLineQtyInput=et;x.recalculateWasteModalTotal=nt;x.submitCreateWaste=Dt;console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{ht as addManualReceiptItem,A as addWasteLineRow,zt as api,Y as closeConfirmClearManualLinesModal,U as closeCreateReceiptModal,tt as closeCreateWasteModal,K as closeManualReceiptModal,G as confirmClearAllManualReceiptLines,Yt as debounce,l as escapeHtml,St as executeClearAllManualReceiptLines,I as filterManualCatalogList,q as formatCompactVND,Xt as formatDateYMD,Gt as formatNumber,S as formatReceiptDateYMD,Kt as formatVND,k as getActiveFnbReceiptSite,M as getActiveFnbWasteSite,L as getReceiptExpWarningHtml,T as loadFnbPoList,at as loadFnbReceipts,gt as loadFnbReceiptsHistory,At as loadFnbWaste,z as loadFnbWasteHistory,N as loadManualCatalogItems,D as loadWasteModalItems,it as onFnbPoSearchInput,It as onFnbWasteFilterChange,Et as onFnbWasteNganhHangChange,$t as onFnbWasteSearch,_t as onFnbWasteSiteChange,vt as onManualLineBatchChange,Lt as onManualLineExpChange,Mt as onManualLineLocChange,wt as onManualLinePriceChange,ft as onManualLineQtyChange,yt as onManualReceiptSiteChange,rt as onReceiptLineBatchChange,dt as onReceiptLineExpChange,ct as onReceiptLineNoteChange,st as onReceiptLineQtyChange,Nt as onWasteLineNoteChange,Rt as onWasteLineQtyChange,Bt as onWasteLineReasonChange,Pt as onWasteModalItemSelect,et as onWasteModalLineQtyInput,Wt as onWasteModalSiteChange,ut as openCreateReceiptModal,Ft as openCreateWasteModal,bt as openManualReceiptModal,Q as openPoReceiptModal,Z as populateFnbWasteFilters,W as populateFnbWasteNhomHangDropdown,J as populateFnbWasteSiteDropdown,nt as recalculateWasteModalTotal,X as removeManualReceiptLine,H as renderFnbPoTable,B as renderFnbWasteStockTable,_ as renderManualReceiptLinesTable,O as renderReceiptLinesTable,kt as setManualLineQuickExp,lt as setReceiptLineQuickExp,pt as submitCreateReceipt,Dt as submitCreateWaste,Ht as submitDirectWaste,Tt as submitManualReceipt,$ as switchFnbReceiptSubView,R as switchFnbWasteSubView,xt as toggleManualShowAllCatalog,F as updateManualTotals,P as updateWasteKPIs,mt as viewReceiptDetail,Ct as viewWasteDetail};
