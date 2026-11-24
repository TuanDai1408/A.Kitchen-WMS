function xe(e){return e==null||isNaN(e)?"0 \u20AB":Math.round(e).toLocaleString("vi-VN")+" \u20AB"}function be(e){if(e==null||isNaN(e))return{val:"\u2014",unit:"",full:"\u2014"};let t=Number(e),n=Math.abs(t),a=t<0?"-":"",r=t.toLocaleString("vi-VN")+" \u20AB";if(n>=1e9){let s=(n/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:a+s,unit:"t\u1EF7 \u20AB",full:r}}else if(n>=1e6){let s=(n/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:a+s,unit:"tr \u20AB",full:r}}else return{val:a+n.toLocaleString("vi-VN"),unit:"\u20AB",full:r}}function ye(e){if(!e)return"\u2014";if(typeof e=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(e.trim()))return e.trim();try{let t=new Date(e);if(isNaN(t.getTime()))return String(e);let n=t.getFullYear(),a=String(t.getMonth()+1).padStart(2,"0"),r=String(t.getDate()).padStart(2,"0");return`${n}-${a}-${r}`}catch{return String(e)}}function he(e,t=1){return e==null||isNaN(e)?"0":Number(e).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:t})}function l(e){return e?String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function fe(e,t=200){let n=null;return function(...a){n&&clearTimeout(n),n=setTimeout(()=>{e.apply(this,a)},t)}}var S=class{cache=new Map;defaultTtl=3e4;async get(t,n=this.defaultTtl){let a=Date.now(),r=this.cache.get(t);if(r&&a-r.timestamp<n)return a-r.timestamp>1e4&&fetch(t).then(s=>s.json()).then(s=>{s.success&&this.cache.set(t,{timestamp:Date.now(),data:s})}).catch(()=>{}),r.data;try{let i=await(await fetch(t)).json();return i.success&&this.cache.set(t,{timestamp:a,data:i}),i}catch(s){return{success:!1,error:s instanceof Error?s.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(t,n){this.cache.clear();try{return await(await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)})).json()}catch(a){return{success:!1,error:a instanceof Error?a.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(t){if(!t){this.cache.clear();return}for(let n of this.cache.keys())n.includes(t)&&this.cache.delete(n)}async getPoList(t,n="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(t)}&status=${encodeURIComponent(n)}`)}async getPoDetails(t){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}`)}async getReceiptHistory(t){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(t)}`)}async getInventory(t){return this.get(`/api/wh/inventory?site=${encodeURIComponent(t)}`)}async submitManualReceipt(t){return this.post("/api/fnb/manual-receipt",t)}},ve=new S;function f(){let e=localStorage.getItem("orbit_user_site");if(e)return e.toUpperCase();let t=window,n=typeof t.App<"u"&&t.App.currentBranch?t.App.currentBranch.toUpperCase():"K001";return n==="ALL"||!n?"K001":n}function v(e){if(!e||e==="\u2014")return"\u2014";let t=String(e).trim(),n=t.match(/^(\d{4})-(\d{2})-(\d{2})/);if(n)return`${n[1]}-${n[2]}-${n[3]}`;try{let a=new Date(t);if(!isNaN(a.getTime())){let r=a.getFullYear(),s=String(a.getMonth()+1).padStart(2,"0"),i=String(a.getDate()).padStart(2,"0");return`${r}-${s}-${i}`}}catch{}return t.slice(0,10)}function y(e){if(!e)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let t=new Date;t.setHours(0,0,0,0);let n=new Date(e);n.setHours(0,0,0,0);let a=Math.ceil((n.getTime()-t.getTime())/(1e3*60*60*24));return a<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(a)} ng\xE0y)</span>`:a===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':a<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${a} ng\xE0y)</span>`:a<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${a} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${a} ng\xE0y</span>`}function k(e){window.gFnbReceiptCurrentView=e;let t=document.getElementById("fnbReceiptTabBtnPo"),n=document.getElementById("fnbReceiptTabBtnHistory"),a=document.getElementById("fnbPoListView"),r=document.getElementById("fnbReceiptHistoryView");e==="po"?(t&&(t.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),a&&a.classList.remove("hidden"),r&&r.classList.add("hidden"),L()):(n&&(n.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),t&&(t.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),r&&r.classList.remove("hidden"),a&&a.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function V(e){let t=e||f(),n=document.getElementById("fnbReceiptFilterSite");n&&(n.value=t);let r=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(o=>o.code.toUpperCase()===t.toUpperCase()),s=r?r.ten||r.name:t,i=document.getElementById("fnbReceiptCurrentSiteBadge");i&&(i.textContent=s),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(t):await L(t)}function O(e){_(e)}async function L(e){let t=e||f(),n=document.getElementById("fnbPoStatusFilter"),a=n?n.value:"OPEN",r=document.getElementById("fnbPoSummaryText");try{r&&(r.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${t}...`);let i=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(t)}&status=${encodeURIComponent(a)}&no-cache=1`)).json();if(i.success&&i.data){window.gFnbPoList=i.data;let o=document.getElementById("fnbPoSearchInput")?.value||"";_(o);let d=(window.gFnbPoList||[]).filter(x=>x.status==="OPEN").length,u=document.getElementById("fnbReceiptBadgePendingCount");u&&(u.textContent=String(d))}else throw new Error(i.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(s){console.error("loadFnbPoList error:",s),r&&(r.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+s.message)}}function _(e=""){let t=document.getElementById("fnbPoTableBody"),n=document.getElementById("fnbPoMobileCards"),a=document.getElementById("fnbPoSummaryText"),r=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),s=(e||"").toLowerCase().trim(),i=window.gFnbPoList||[];r&&(i=i.filter(o=>{let d=(o.supplier_name||"").toLowerCase();return r==="siba"?d.includes("siba")||d.includes("b\u1EBFp trung t\xE2m")||d.includes("trung t\xE2m"):r==="baf"?d.includes("baf")||d.includes("th\u1ECBt"):r==="spice"?d.includes("gia v\u1ECB")||d.includes("\u0111\u01B0\u1EDDng")||d.includes("unilever")||d.includes("cholimex")||d.includes("mu\u1ED1i"):r==="veg"?d.includes("rau")||d.includes("\u0111\xE0 l\u1EA1t")||d.includes("c\u1EE7"):!0})),s&&(i=i.filter(o=>{let d=(o.po_number||"").toLowerCase(),u=(o.supplier_name||"").toLowerCase(),x=(o.supplier_code||"").toLowerCase();return d.includes(s)||u.includes(s)||x.includes(s)})),a&&(a.textContent=`Hi\u1EC3n th\u1ECB ${i.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),t&&(i.length===0?t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':t.innerHTML=i.map(o=>{let d=o.status==="OPEN",u=o.status==="COMPLETED",x=u?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',p=(o.po_number||"").startsWith("50000")||!o.supplier_code||o.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',g=Number(o.total_amount)||0,m=Number(o.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${l(o.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${l(v(o.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${p}
                <span class="font-medium text-gray-900 dark:text-white">${l(o.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${o.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${l(o.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${o.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${m.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${g>0?Math.round(g).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${x}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${l(o.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${u?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${u?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${u?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),n&&(i.length===0?n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':n.innerHTML=i.map(o=>{let d=o.status==="COMPLETED",u=(o.po_number||"").startsWith("50000")||!o.supplier_code||o.supplier_name==="B\u1EBFp Trung T\xE2m Siba",x=Number(o.total_amount)||0,b=Number(o.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${u?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${u?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${l(o.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${l(o.po_number)} \u2022 ${l(v(o.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${d?"text-emerald-600":"text-amber-600"} block">${d?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${o.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${b.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${x>0?Math.round(x).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${l(o.po_number)}')" class="w-full py-2 rounded-xl ${d?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${d?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${d?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function $(e){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+e+"...");let n=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(e)}&no-cache=1`)).json();if(!n.success||!n.data)throw new Error(n.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let a=n.data;if(!a.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let r=a[0],s=document.getElementById("receiptModalInvoice"),i=document.getElementById("receiptModalInvoiceDisplay"),o=document.getElementById("receiptModalSite"),d=document.getElementById("receiptModalSiteDisplay"),u=document.getElementById("receiptModalSupplier"),x=document.getElementById("receiptModalSupplierDisplay"),b=document.getElementById("receiptModalDate"),p=new Date().toISOString().slice(0,10);s&&(s.value=r.po_number),i&&(i.textContent=r.po_number),o&&(o.value=r.site),d&&(d.textContent=r.site),u&&(u.value=r.supplier_name),x&&(x.textContent=r.supplier_name),b&&(b.value=p);let g="L\xD4-"+p.replace(/-/g,"").slice(2),m=new Date;m.setFullYear(m.getFullYear()+1);let h=m.toISOString().slice(0,10);window.gReceiptLines=a.map(w=>{let E=(w.merch_category||"").toLowerCase(),A=!E.includes("bao b\xEC")&&!E.includes("c\xF4ng c\u1EE5")&&!E.includes("h\xF3a ch\u1EA5t")&&!E.includes("t\u1EA1p ph\u1EA9m");return{po_item:w.po_item,item_code:w.item_code,item_name:w.item_name,merch_category:w.merch_category,unit:w.unit||"KG",unit_price:Number(w.unit_price)||0,order_qty:Number(w.order_qty)||0,actual_qty:Number(w.order_qty)||0,batch_code:g,exp_date:A?h:"",is_food:A,note:""}}),B();let T=document.getElementById("createReceiptModal");T&&T.classList.remove("hidden")}catch(t){console.error("openPoReceiptModal error:",t),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+t.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function B(){let e=document.getElementById("receiptLinesTableBody"),t=document.getElementById("receiptLinesMobileCards"),n=document.getElementById("receiptModalLineCount"),a=document.getElementById("receiptModalTotalAmount"),r=window.gReceiptLines||[];n&&(n.textContent=String(r.length));let s=0;e&&(e.innerHTML=r.map((i,o)=>{let d=(i.actual_qty||0)*(i.unit_price||0);return s+=d,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${o+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${l(i.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${l(i.item_code)}</span>
              ${i.merch_category?`<span>\u2022</span><span>${l(i.merch_category)}</span>`:""}
              ${i.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${l(i.unit||"")}
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300">
            ${Number(i.unit_price).toLocaleString("vi-VN")} \u0111
          </td>
          <td class="py-2.5 px-3 text-right tabular-nums text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/20">
            ${Number(i.order_qty).toFixed(1)}
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="number" step="0.01" min="0" value="${i.actual_qty}" 
                   oninput="onReceiptLineQtyChange(${o}, this.value)" 
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono">
          </td>
          <td class="py-2.5 px-3 text-center">
            <input type="text" value="${l(i.batch_code||"")}" placeholder="L\xF4 SX..." 
                   oninput="onReceiptLineBatchChange(${o}, this.value)" 
                   class="w-28 text-center py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2.5 px-3 text-center">
            <div class="flex flex-col items-center">
              <input type="date" id="receiptLineExpInput_${o}" value="${i.exp_date||""}" 
                     onchange="onReceiptLineExpChange(${o}, this.value)" 
                     class="w-32 py-1 px-1.5 text-center rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
              <div class="flex items-center gap-1 mt-1">
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 1)" title="+1 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 6)" title="+6 Th\xE1ng" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 12)" title="+1 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 24)" title="+2 N\u0103m" class="px-1.5 py-0.5 text-xs font-semibold rounded bg-gray-100 hover:bg-brand-50 hover:text-brand-600 dark:bg-gray-800 dark:hover:bg-brand-900/40 text-gray-600 dark:text-gray-300 transition-colors">+2N</button>
              </div>
              <div id="receiptExpWarning_${o}" class="mt-1">
                ${y(i.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${o}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${d>0?Math.round(d).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${l(i.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${o}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),t&&(t.innerHTML=r.map((i,o)=>{let d=(i.actual_qty||0)*(i.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${l(i.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${l(i.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${l(i.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(i.unit_price).toLocaleString("vi-VN")} \u0111</div>
            </div>
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">#${o+1}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl text-center tabular-nums text-xs">
            <div>
              <span class="text-gray-400 block text-[11px]">SL \u0110\u1EB7t SAP:</span>
              <span class="font-bold text-gray-700 dark:text-gray-300">${Number(i.order_qty).toFixed(1)}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Th\xE0nh ti\u1EC1n:</span>
              <span id="receiptLineTotalMob_${o}" class="num font-bold text-brand-600 dark:text-brand-400">${d>0?Math.round(d).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
            </div>
            <div>
              <span class="text-gray-400 block text-[11px]">Ph\xE2n lo\u1EA1i:</span>
              <span class="text-xs font-medium">${i.is_food?"Th\u1EF1c ph\u1EA9m":"V\u1EADt t\u01B0"}</span>
            </div>
          </div>

          <div class="space-y-2 pt-1 text-xs">
            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">SL th\u1EF1c nh\u1EADp:</label>
              <input type="number" step="0.01" min="0" value="${i.actual_qty}" 
                     oninput="onReceiptLineQtyChange(${o}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-brand-300 dark:border-brand-700 bg-brand-50/40 dark:bg-brand-950/30 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-brand-500 font-mono text-center">
            </div>

            <div class="flex items-center gap-2">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">S\u1ED1 l\xF4 (Batch):</label>
              <input type="text" value="${l(i.batch_code||"")}" placeholder="L\xF4 SX..." 
                     oninput="onReceiptLineBatchChange(${o}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>

            <div>
              <div class="flex items-center gap-2 mb-1.5">
                <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">H\u1EA1n d\xF9ng (EXP):</label>
                <input type="date" id="receiptLineExpInputMob_${o}" value="${i.exp_date||""}" 
                       onchange="onReceiptLineExpChange(${o}, this.value)" 
                       class="flex-1 py-1 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-700 dark:text-gray-300 outline-none">
              </div>
              <div class="flex items-center gap-1.5 justify-end">
                <span class="text-[11px] text-gray-400">Ch\u1ECDn nhanh:</span>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 1)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 6)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+6T</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 12)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+1N</button>
                <button type="button" onclick="setReceiptLineQuickExp(${o}, 24)" class="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300">+2N</button>
              </div>
              <div id="receiptExpWarningMob_${o}" class="mt-1">
                ${y(i.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${l(i.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${o}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),a&&(a.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function j(e,t){if(!window.gReceiptLines||!window.gReceiptLines[e])return;let n=parseFloat(t);window.gReceiptLines[e].actual_qty=isNaN(n)?0:n;let a=window.gReceiptLines[e],r=(a.actual_qty||0)*(a.unit_price||0),s=document.getElementById(`receiptLineTotal_${e}`);s&&(s.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let i=document.getElementById(`receiptLineTotalMob_${e}`);i&&(i.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let o=0;window.gReceiptLines.forEach(u=>{o+=(u.actual_qty||0)*(u.unit_price||0)});let d=document.getElementById("receiptModalTotalAmount");d&&(d.textContent=o>0?Math.round(o).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function q(e,t){!window.gReceiptLines||!window.gReceiptLines[e]||(window.gReceiptLines[e].batch_code=t)}function Q(e,t){if(!window.gReceiptLines||!window.gReceiptLines[e])return;window.gReceiptLines[e].exp_date=t;let n=document.getElementById(`receiptExpWarning_${e}`);n&&(n.innerHTML=y(t));let a=document.getElementById(`receiptExpWarningMob_${e}`);a&&(a.innerHTML=y(t)),window.lucide&&window.lucide.createIcons()}function U(e,t){if(!window.gReceiptLines||!window.gReceiptLines[e])return;let n=new Date;n.setMonth(n.getMonth()+t);let a=n.toISOString().slice(0,10);window.gReceiptLines[e].exp_date=a;let r=document.getElementById(`receiptLineExpInput_${e}`);r&&(r.value=a);let s=document.getElementById(`receiptLineExpInputMob_${e}`);s&&(s.value=a);let i=document.getElementById(`receiptExpWarning_${e}`);i&&(i.innerHTML=y(a));let o=document.getElementById(`receiptExpWarningMob_${e}`);o&&(o.innerHTML=y(a)),window.lucide&&window.lucide.createIcons()}function K(e,t){!window.gReceiptLines||!window.gReceiptLines[e]||(window.gReceiptLines[e].note=t)}function N(){let e=document.getElementById("createReceiptModal");e&&e.classList.add("hidden")}function W(){window.gFnbPoList&&window.gFnbPoList.length?$(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function X(){let t=(window.gReceiptLines||[]).filter(p=>(p.actual_qty||0)>0);if(!t.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let n=new Date;n.setHours(0,0,0,0);let a=!1;for(let p of t)if(p.exp_date){let g=new Date(p.exp_date);if(g.setHours(0,0,0,0),g<=n){a=!0;break}}if(a&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let r=document.getElementById("receiptModalSite")?.value||f(),s=document.getElementById("receiptModalInvoice")?.value||"",i=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),o=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",d=document.getElementById("receiptModalNotes")?.value||"",u=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",x={site_code:r,receipt_date:i,supplier:o,invoice_no:s,notes:d,created_by:u,lines:t.map(p=>({item_code:p.item_code,qty:p.actual_qty,unit_price:p.unit_price,batch_code:(p.batch_code||"").trim(),exp_date:(p.exp_date||"").trim()||null,note:p.note||""}))},b=document.getElementById("btnSubmitReceipt");b&&(b.disabled=!0,b.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let g=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(x)})).json();if(!g.success)throw new Error(g.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${g.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${r} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),N(),await L(r),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(r),k("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(p){console.error("submitCreateReceipt error:",p),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+p.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),b&&(b.disabled=!1,b.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function G(e){let t=e||f(),n=document.getElementById("fnbReceiptsTableBody"),a=document.getElementById("fnbReceiptsMobileCards");try{let s=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();if(s.success&&s.data){let i=s.data.receipts||[],o=document.getElementById("fnbReceiptBadgeHistoryCount");o&&(o.textContent=String(i.length)),n&&(i.length?n.innerHTML=i.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${l(d.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${l(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${l(v(d.receipt_date))}</td>
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
          `).join(""):n.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${l(t)}.</td></tr>`),a&&(i.length?a.innerHTML=i.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${l(d.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${l(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${l(v(d.receipt_date))} \u2022 PO: ${l(d.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${l(d.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):a.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(r){console.error("loadFnbReceiptsHistory error:",r)}}async function Y(e){try{typeof window.showLoading=="function"&&window.showLoading();let n=await(await fetch(`/api/fnb/receipts?id=${e}`)).json();if(!n.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let a=n.data.lines||[],r=document.getElementById("invDetailModal"),s=document.getElementById("invDetailModalTitle"),i=document.getElementById("invDetailModalSub");s&&(s.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${e}`),i&&(i.textContent=`${a.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let o=`
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
            ${a.map(u=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${l(u.item_name||u.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${l(u.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(u.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${l(u.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${u.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${l(u.exp_date?String(u.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(u.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(u.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${l(u.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=o),r&&r.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(t){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+t.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function J(e){let t=e||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||f()||"K001",a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(T=>T.code.toUpperCase()===t.toUpperCase()),r=a?a.ten||a.name:t,s=r.startsWith(t)?r:`${t} - ${r}`,i=document.getElementById("manualReceiptSiteNameDisplay");i&&(i.textContent=s);let o=document.getElementById("manualReceiptSiteSelect");o&&(o.value=t);let d=document.getElementById("manualReceiptSiteBadge");d&&(d.textContent=t);let u=document.getElementById("manualReceiptDate");u&&(u.value=new Date().toISOString().slice(0,10));let x=document.getElementById("manualReceiptSupplier");x&&!x.value&&(x.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let b=document.getElementById("manualReceiptInvoiceNo");b&&(b.value="");let p=document.getElementById("manualReceiptNotes");p&&(p.value="");let g=document.getElementById("manualItemSearchInput");g&&(g.value="");let m=document.getElementById("manualItemCategorySelect");m&&(m.value=""),window.gManualReceiptLines=[],R();let h=document.getElementById("modalManualReceipt");h&&h.classList.remove("hidden"),await C(t,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function P(){let e=document.getElementById("modalManualReceipt");e&&e.classList.add("hidden")}async function z(e){let t=document.getElementById("manualReceiptSiteBadge");t&&(t.textContent=e),await C(e,window.gManualShowAllCatalog)}async function Z(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let e=document.getElementById("txtToggleManualCatalog");e&&(e.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let t=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await C(t,window.gManualShowAllCatalog)}async function C(e,t){let n=document.getElementById("manualCatalogListContainer");n&&(n.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let a=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(e)}${t?"&include_all=1":""}`,s=await(await fetch(a)).json();s.success&&s.data?window.gManualSiteCatalog=s.data.items||[]:window.gManualSiteCatalog=[],M()}catch(a){console.error("loadManualCatalogItems error:",a),n&&(n.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${l(a.message)}</div>`)}}function M(){let e=document.getElementById("manualCatalogListContainer"),t=document.getElementById("manualCatalogCountText"),n=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),a=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),r=window.gManualSiteCatalog||[];if(n&&(r=r.filter(s=>{let i=(s.code||s.sku||"").toLowerCase(),o=(s.name||"").toLowerCase();return i.includes(n)||o.includes(n)})),a&&(r=r.filter(s=>(s.nhom_hang||s.item_group||s.nganh_hang||"").toLowerCase().includes(a))),t&&(t.textContent=String(r.length)),!!e){if(!r.length){e.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${n?`v\u1EDBi t\u1EEB kh\xF3a "${l(n)}"`:""}.
      </div>
    `;return}e.innerHTML=r.map(s=>{let i=s.code||s.sku,o=(window.gManualReceiptLines||[]).find(x=>x.item_code===i),d=parseFloat(s.book_qty||0),u=parseFloat(s.unit_price||0);return`
      <div onclick="addManualReceiptItem('${i}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${o?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${l(s.name||i)}">
              ${l(s.name||i)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${l(s.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${l(i)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${d>0?"text-emerald-600":"text-gray-500"} font-mono">${d.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${u>0?Math.round(u).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
          </div>
        </div>
        <div>
          ${o?`
            <span class="px-2 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1 shrink-0 shadow-xs font-mono">
              <i data-lucide="check" class="w-3 h-3"></i> x${o.qty}
            </span>
          `:`
            <button type="button" class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-emerald-500 hover:text-white text-gray-700 dark:text-gray-300 text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors">
              <i data-lucide="plus" class="w-3 h-3"></i> Th\xEAm
            </button>
          `}
        </div>
      </div>
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function ee(e){let t=(window.gManualSiteCatalog||[]).find(a=>(a.code||a.sku)===e);if(!t)return;let n=(window.gManualReceiptLines||[]).find(a=>a.item_code===e);if(n)n.qty=Math.round((n.qty+1)*100)/100;else{let r="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),s=new Date;s.setFullYear(s.getFullYear()+1);let i=s.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:t.code||t.sku,item_name:t.name||t.code,unit:t.unit||"Ph\u1EA7n",unit_price:parseFloat(t.unit_price||0),qty:1,batch_code:r,exp_date:i,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}R(),M()}function R(){let e=document.getElementById("manualLinesEmptyState"),t=document.getElementById("manualLinesTableWrapper"),n=document.getElementById("manualLinesMobileCards"),a=document.getElementById("btnClearAllManualLines"),r=document.getElementById("manualLinesTableBody"),s=document.getElementById("manualSelectedCountText"),i=document.getElementById("manualSummaryTotalSkus"),o=document.getElementById("manualSummaryTotalQty"),d=document.getElementById("manualSummaryTotalAmount"),u=window.gManualReceiptLines||[];if(s&&(s.textContent=String(u.length)),i&&(i.textContent=u.length+" m\xE3"),!u.length){e&&e.classList.remove("hidden"),t&&(t.classList.add("hidden"),t.classList.remove("lg:block")),n&&(n.classList.add("hidden"),n.classList.remove("block")),a&&(a.classList.add("hidden"),a.classList.remove("flex")),o&&(o.textContent="0"),d&&(d.textContent="0 \u0111");return}e&&e.classList.add("hidden"),t&&(t.classList.remove("hidden"),t.classList.add("lg:block")),n&&(n.classList.remove("hidden"),n.classList.add("block")),a&&(a.classList.remove("hidden"),a.classList.add("flex"));let x=0,b=0;r&&(r.innerHTML=u.map((p,g)=>{let m=(p.qty||0)*(p.unit_price||0);return x+=p.qty||0,b+=m,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${g+1}</td>
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
                   oninput="onManualLineQtyChange(${g}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${p.unit_price}" 
                   oninput="onManualLinePriceChange(${g}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${g}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${m>0?Math.round(m).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${l(p.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${g}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${p.exp_date||""}" 
                   onchange="onManualLineExpChange(${g}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${l(p.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${g}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${g})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=u.map((p,g)=>{let m=(p.qty||0)*(p.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${g+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${l(p.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${l(p.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${g})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${l(p.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${p.qty}" 
                     oninput="onManualLineQtyChange(${g}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${p.unit_price}" 
                     oninput="onManualLinePriceChange(${g}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${m>0?Math.round(m).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${l(p.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${g}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${p.exp_date||""}" 
                   onchange="onManualLineExpChange(${g}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),o&&(o.textContent=x>0?Number.isInteger(x)?String(x):x.toFixed(1):"0"),d&&(d.textContent=b>0?Math.round(b).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function te(e,t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let n=parseFloat(t);window.gManualReceiptLines[e].qty=isNaN(n)?0:n,I()}function ne(e,t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let n=parseFloat(t);window.gManualReceiptLines[e].unit_price=isNaN(n)?0:n,I()}function I(){let e=0,t=0;(window.gManualReceiptLines||[]).forEach((r,s)=>{let i=(r.qty||0)*(r.unit_price||0);e+=r.qty||0,t+=i;let o=document.getElementById(`manualLineTotal_${s}`);o&&(o.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let n=document.getElementById("manualSummaryTotalQty"),a=document.getElementById("manualSummaryTotalAmount");n&&(n.textContent=e.toFixed(1)),a&&(a.textContent=Math.round(t).toLocaleString("vi-VN")+" \u0111")}function ae(e,t){!window.gManualReceiptLines||!window.gManualReceiptLines[e]||(window.gManualReceiptLines[e].batch_code=t)}function oe(e,t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;window.gManualReceiptLines[e].exp_date=t;let n=document.getElementById(`manualLineExpWarning_${e}`);n&&(n.innerHTML=y(t),window.lucide&&window.lucide.createIcons())}function ie(e,t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let n=new Date;n.setMonth(n.getMonth()+t);let a=n.toISOString().slice(0,10);window.gManualReceiptLines[e].exp_date=a;let r=document.getElementById(`manualLineExpInput_${e}`);r&&(r.value=a);let s=document.getElementById(`manualLineExpWarning_${e}`);s&&(s.innerHTML=y(a),window.lucide&&window.lucide.createIcons())}function re(e,t){!window.gManualReceiptLines||!window.gManualReceiptLines[e]||(window.gManualReceiptLines[e].storage_loc=t)}function H(e){if(!window.gManualReceiptLines||!window.gManualReceiptLines[e])return;let t=window.gManualReceiptLines[e];window.gManualReceiptLines.splice(e,1),R(),typeof M=="function"&&M(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(t.item_name||t.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function F(){let e=window.gManualReceiptLines||[];if(!e.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let t=document.getElementById("confirmClearManualCountText");t&&(t.textContent=String(e.length));let n=document.getElementById("modalConfirmClearManualLines");n&&(n.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function D(){let e=document.getElementById("modalConfirmClearManualLines");e&&e.classList.add("hidden")}function se(){let e=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],D(),R(),M(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${e} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function de(){let t=(window.gManualReceiptLines||[]).filter(m=>(m.qty||0)>0);if(!t.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let n=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!n){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let a=new Date;a.setHours(0,0,0,0);let r=!1;for(let m of t)if(m.exp_date){let h=new Date(m.exp_date);if(h.setHours(0,0,0,0),h<=a){r=!0;break}}if(r&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let s=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",i=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),o=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",d=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",u=(document.getElementById("manualReceiptNotes")?.value||"").trim(),x=`[${o}] ${u}`.trim(),b=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",p={site_code:s,receipt_date:i,supplier:n,invoice_no:d,notes:x,created_by:b,lines:t.map(m=>({item_code:m.item_code,qty:m.qty,unit_price:m.unit_price,batch_code:(m.batch_code||"").trim(),exp_date:(m.exp_date||"").trim()||null,storage_loc:m.storage_loc||"K\u1EC7 B\u1EBFp",note:m.note||""}))},g=document.getElementById("btnSubmitManualReceipt");g&&(g.disabled=!0,g.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let h=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(p)})).json();if(!h.success)throw new Error(h.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${h.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${s} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),P(),await L(s),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(s),k("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(m){console.error("submitManualReceipt error:",m),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+m.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),g&&(g.disabled=!1,g.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var c=window;c.gFnbReceiptCurrentView=c.gFnbReceiptCurrentView||"po";c.gFnbPoList=c.gFnbPoList||[];c.gReceiptLines=c.gReceiptLines||[];c.gManualReceiptLines=c.gManualReceiptLines||[];c.gManualSiteCatalog=c.gManualSiteCatalog||[];c.gManualShowAllCatalog=c.gManualShowAllCatalog||!1;c.getActiveFnbReceiptSite=f;c.formatReceiptDateYMD=v;c.getReceiptExpWarningHtml=y;c.switchFnbReceiptSubView=k;c.loadFnbReceipts=V;c.onFnbPoSearchInput=O;c.loadFnbPoList=L;c.renderFnbPoTable=_;c.openPoReceiptModal=$;c.renderReceiptLinesTable=B;c.onReceiptLineQtyChange=j;c.onReceiptLineBatchChange=q;c.onReceiptLineExpChange=Q;c.setReceiptLineQuickExp=U;c.onReceiptLineNoteChange=K;c.closeCreateReceiptModal=N;c.openCreateReceiptModal=W;c.submitCreateReceipt=X;c.loadFnbReceiptsHistory=G;c.viewReceiptDetail=Y;c.openManualReceiptModal=J;c.closeManualReceiptModal=P;c.onManualReceiptSiteChange=z;c.toggleManualShowAllCatalog=Z;c.loadManualCatalogItems=C;c.filterManualCatalogList=M;c.addManualReceiptItem=ee;c.renderManualReceiptLinesTable=R;c.onManualLineQtyChange=te;c.onManualLinePriceChange=ne;c.updateManualTotals=I;c.onManualLineBatchChange=ae;c.onManualLineExpChange=oe;c.setManualLineQuickExp=ie;c.onManualLineLocChange=re;c.removeManualReceiptLine=H;c.removeManualLine=H;c.confirmClearAllManualReceiptLines=F;c.clearAllManualReceiptLines=F;c.closeConfirmClearManualLinesModal=D;c.executeClearAllManualReceiptLines=se;c.submitManualReceipt=de;console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{ee as addManualReceiptItem,ve as api,D as closeConfirmClearManualLinesModal,N as closeCreateReceiptModal,P as closeManualReceiptModal,F as confirmClearAllManualReceiptLines,fe as debounce,l as escapeHtml,se as executeClearAllManualReceiptLines,M as filterManualCatalogList,be as formatCompactVND,ye as formatDateYMD,he as formatNumber,v as formatReceiptDateYMD,xe as formatVND,f as getActiveFnbReceiptSite,y as getReceiptExpWarningHtml,L as loadFnbPoList,V as loadFnbReceipts,G as loadFnbReceiptsHistory,C as loadManualCatalogItems,O as onFnbPoSearchInput,ae as onManualLineBatchChange,oe as onManualLineExpChange,re as onManualLineLocChange,ne as onManualLinePriceChange,te as onManualLineQtyChange,z as onManualReceiptSiteChange,q as onReceiptLineBatchChange,Q as onReceiptLineExpChange,K as onReceiptLineNoteChange,j as onReceiptLineQtyChange,W as openCreateReceiptModal,J as openManualReceiptModal,$ as openPoReceiptModal,H as removeManualReceiptLine,_ as renderFnbPoTable,R as renderManualReceiptLinesTable,B as renderReceiptLinesTable,ie as setManualLineQuickExp,U as setReceiptLineQuickExp,X as submitCreateReceipt,de as submitManualReceipt,k as switchFnbReceiptSubView,Z as toggleManualShowAllCatalog,I as updateManualTotals,Y as viewReceiptDetail};
