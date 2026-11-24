function H(t){return t==null||isNaN(t)?"0 \u20AB":Math.round(t).toLocaleString("vi-VN")+" \u20AB"}function Zt(t){if(t==null||isNaN(t))return{val:"\u2014",unit:"",full:"\u2014"};let n=Number(t),o=Math.abs(n),e=n<0?"-":"",a=n.toLocaleString("vi-VN")+" \u20AB";if(o>=1e9){let i=(o/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:e+i,unit:"t\u1EF7 \u20AB",full:a}}else if(o>=1e6){let i=(o/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:e+i,unit:"tr \u20AB",full:a}}else return{val:e+o.toLocaleString("vi-VN"),unit:"\u20AB",full:a}}function Yo(t){if(!t)return"\u2014";if(typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t.trim()))return t.trim();try{let n=new Date(t);if(isNaN(n.getTime()))return String(t);let o=n.getFullYear(),e=String(n.getMonth()+1).padStart(2,"0"),a=String(n.getDate()).padStart(2,"0");return`${o}-${e}-${a}`}catch{return String(t)}}function U(t){if(!t)return"\u2014";try{let n=new Date(t);if(isNaN(n.getTime()))return String(t);let o=String(n.getDate()).padStart(2,"0"),e=String(n.getMonth()+1).padStart(2,"0"),a=n.getFullYear();return`${o}/${e}/${a}`}catch{return String(t)}}function L(t,n=1){return t==null||isNaN(t)?"0":Number(t).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:n})}function f(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function Zo(t,n=200){let o=null;return function(...e){o&&clearTimeout(o),o=setTimeout(()=>{t.apply(this,e)},n)}}var te=class{cache=new Map;defaultTtl=3e4;async get(n,o=this.defaultTtl){let e=Date.now(),a=this.cache.get(n);if(a&&e-a.timestamp<o)return e-a.timestamp>1e4&&fetch(n).then(i=>i.json()).then(i=>{i.success&&this.cache.set(n,{timestamp:Date.now(),data:i})}).catch(()=>{}),a.data;try{let r=await(await fetch(n)).json();return r.success&&this.cache.set(n,{timestamp:e,data:r}),r}catch(i){return{success:!1,error:i instanceof Error?i.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(n,o){this.cache.clear();try{return await(await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json()}catch(e){return{success:!1,error:e instanceof Error?e.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(n){if(!n){this.cache.clear();return}for(let o of this.cache.keys())o.includes(n)&&this.cache.delete(o)}async getPoList(n,o="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(n)}&status=${encodeURIComponent(o)}`)}async getPoDetails(n){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(n)}`)}async getReceiptHistory(n){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(n)}`)}async getInventory(n){return this.get(`/api/wh/inventory?site=${encodeURIComponent(n)}`)}async submitManualReceipt(n){return this.post("/api/fnb/manual-receipt",n)}},ea=new te;function W(){let t=localStorage.getItem("orbit_user_site");if(t)return t.toUpperCase();let n=window,o=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():"K001";return o==="ALL"||!o?"K001":o}function et(t){if(!t||t==="\u2014")return"\u2014";let n=String(t).trim(),o=n.match(/^(\d{4})-(\d{2})-(\d{2})/);if(o)return`${o[1]}-${o[2]}-${o[3]}`;try{let e=new Date(n);if(!isNaN(e.getTime())){let a=e.getFullYear(),i=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${a}-${i}-${r}`}}catch{}return n.slice(0,10)}function R(t){if(!t)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let n=new Date;n.setHours(0,0,0,0);let o=new Date(t);o.setHours(0,0,0,0);let e=Math.ceil((o.getTime()-n.getTime())/(1e3*60*60*24));return e<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(e)} ng\xE0y)</span>`:e===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':e<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${e} ng\xE0y)</span>`:e<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${e} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${e} ng\xE0y</span>`}function dt(t){window.gFnbReceiptCurrentView=t;let n=document.getElementById("fnbReceiptTabBtnPo"),o=document.getElementById("fnbReceiptTabBtnHistory"),e=document.getElementById("fnbPoListView"),a=document.getElementById("fnbReceiptHistoryView");t==="po"?(n&&(n.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),e&&e.classList.remove("hidden"),a&&a.classList.add("hidden"),nt()):(o&&(o.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),a&&a.classList.remove("hidden"),e&&e.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function qe(t){let n=t||W(),o=document.getElementById("fnbReceiptFilterSite");o&&(o.value=n);let a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(s=>s.code.toUpperCase()===n.toUpperCase()),i=a?a.ten||a.name:n,r=document.getElementById("fnbReceiptCurrentSiteBadge");r&&(r.textContent=i),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(n):await nt(n)}function Ue(t){It(t)}async function nt(t){let n=t||W(),o=document.getElementById("fnbPoStatusFilter"),e=o?o.value:"OPEN",a=document.getElementById("fnbPoSummaryText");try{a&&(a.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${n}...`);let r=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(n)}&status=${encodeURIComponent(e)}&no-cache=1`)).json();if(r.success&&r.data){window.gFnbPoList=r.data;let s=document.getElementById("fnbPoSearchInput")?.value||"";It(s);let l=(window.gFnbPoList||[]).filter(c=>c.status==="OPEN").length,d=document.getElementById("fnbReceiptBadgePendingCount");d&&(d.textContent=String(l))}else throw new Error(r.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(i){console.error("loadFnbPoList error:",i),a&&(a.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+i.message)}}function It(t=""){let n=document.getElementById("fnbPoTableBody"),o=document.getElementById("fnbPoMobileCards"),e=document.getElementById("fnbPoSummaryText"),a=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),i=(t||"").toLowerCase().trim(),r=window.gFnbPoList||[];a&&(r=r.filter(s=>{let l=(s.supplier_name||"").toLowerCase();return a==="siba"?l.includes("siba")||l.includes("b\u1EBFp trung t\xE2m")||l.includes("trung t\xE2m"):a==="baf"?l.includes("baf")||l.includes("th\u1ECBt"):a==="spice"?l.includes("gia v\u1ECB")||l.includes("\u0111\u01B0\u1EDDng")||l.includes("unilever")||l.includes("cholimex")||l.includes("mu\u1ED1i"):a==="veg"?l.includes("rau")||l.includes("\u0111\xE0 l\u1EA1t")||l.includes("c\u1EE7"):!0})),i&&(r=r.filter(s=>{let l=(s.po_number||"").toLowerCase(),d=(s.supplier_name||"").toLowerCase(),c=(s.supplier_code||"").toLowerCase();return l.includes(i)||d.includes(i)||c.includes(i)})),e&&(e.textContent=`Hi\u1EC3n th\u1ECB ${r.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),n&&(r.length===0?n.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':n.innerHTML=r.map(s=>{let l=s.status==="OPEN",d=s.status==="COMPLETED",c=d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':l?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',g=(s.po_number||"").startsWith("50000")||!s.supplier_code||s.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',b=Number(s.total_amount)||0,y=Number(s.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${f(s.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${f(et(s.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${g}
                <span class="font-medium text-gray-900 dark:text-white">${f(s.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${s.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${f(s.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${s.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${y.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${b>0?Math.round(b).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${c}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${f(s.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${d?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${d?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${d?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),o&&(r.length===0?o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':o.innerHTML=r.map(s=>{let l=s.status==="COMPLETED",d=(s.po_number||"").startsWith("50000")||!s.supplier_code||s.supplier_name==="B\u1EBFp Trung T\xE2m Siba",c=Number(s.total_amount)||0,u=Number(s.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${d?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${d?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${f(s.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${f(s.po_number)} \u2022 ${f(et(s.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${l?"text-emerald-600":"text-amber-600"} block">${l?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${s.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${u.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${c>0?Math.round(c).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${f(s.po_number)}')" class="w-full py-2 rounded-xl ${l?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${l?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${l?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function ee(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+t+"...");let o=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}&no-cache=1`)).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let e=o.data;if(!e.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let a=e[0],i=document.getElementById("receiptModalInvoice"),r=document.getElementById("receiptModalInvoiceDisplay"),s=document.getElementById("receiptModalSite"),l=document.getElementById("receiptModalSiteDisplay"),d=document.getElementById("receiptModalSupplier"),c=document.getElementById("receiptModalSupplierDisplay"),u=document.getElementById("receiptModalDate"),g=new Date().toISOString().slice(0,10);i&&(i.value=a.po_number),r&&(r.textContent=a.po_number),s&&(s.value=a.site),l&&(l.textContent=a.site),d&&(d.value=a.supplier_name),c&&(c.textContent=a.supplier_name),u&&(u.value=g);let b="L\xD4-"+g.replace(/-/g,"").slice(2),y=new Date;y.setFullYear(y.getFullYear()+1);let p=y.toISOString().slice(0,10);window.gReceiptLines=e.map(m=>{let w=(m.merch_category||"").toLowerCase(),x=!w.includes("bao b\xEC")&&!w.includes("c\xF4ng c\u1EE5")&&!w.includes("h\xF3a ch\u1EA5t")&&!w.includes("t\u1EA1p ph\u1EA9m");return{po_item:m.po_item,item_code:m.item_code,item_name:m.item_name,merch_category:m.merch_category,unit:m.unit||"KG",unit_price:Number(m.unit_price)||0,order_qty:Number(m.order_qty)||0,actual_qty:Number(m.order_qty)||0,batch_code:b,exp_date:x?p:"",is_food:x,note:""}}),ne();let h=document.getElementById("createReceiptModal");h&&h.classList.remove("hidden")}catch(n){console.error("openPoReceiptModal error:",n),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function ne(){let t=document.getElementById("receiptLinesTableBody"),n=document.getElementById("receiptLinesMobileCards"),o=document.getElementById("receiptModalLineCount"),e=document.getElementById("receiptModalTotalAmount"),a=window.gReceiptLines||[];o&&(o.textContent=String(a.length));let i=0;t&&(t.innerHTML=a.map((r,s)=>{let l=(r.actual_qty||0)*(r.unit_price||0);return i+=l,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${s+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${f(r.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${f(r.item_code)}</span>
              ${r.merch_category?`<span>\u2022</span><span>${f(r.merch_category)}</span>`:""}
              ${r.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${f(r.unit||"")}
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
            <input type="text" value="${f(r.batch_code||"")}" placeholder="L\xF4 SX..." 
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
                ${R(r.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${s}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${l>0?Math.round(l).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${f(r.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${s}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=a.map((r,s)=>{let l=(r.actual_qty||0)*(r.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${f(r.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${f(r.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${f(r.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(r.unit_price).toLocaleString("vi-VN")} \u0111</div>
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
              <span id="receiptLineTotalMob_${s}" class="num font-bold text-brand-600 dark:text-brand-400">${l>0?Math.round(l).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
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
              <input type="text" value="${f(r.batch_code||"")}" placeholder="L\xF4 SX..." 
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
                ${R(r.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${f(r.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${s}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),e&&(e.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function Xe(t,n){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let o=parseFloat(n);window.gReceiptLines[t].actual_qty=isNaN(o)?0:o;let e=window.gReceiptLines[t],a=(e.actual_qty||0)*(e.unit_price||0),i=document.getElementById(`receiptLineTotal_${t}`);i&&(i.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let r=document.getElementById(`receiptLineTotalMob_${t}`);r&&(r.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let s=0;window.gReceiptLines.forEach(d=>{s+=(d.actual_qty||0)*(d.unit_price||0)});let l=document.getElementById("receiptModalTotalAmount");l&&(l.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function Ke(t,n){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].batch_code=n)}function Ge(t,n){if(!window.gReceiptLines||!window.gReceiptLines[t])return;window.gReceiptLines[t].exp_date=n;let o=document.getElementById(`receiptExpWarning_${t}`);o&&(o.innerHTML=R(n));let e=document.getElementById(`receiptExpWarningMob_${t}`);e&&(e.innerHTML=R(n)),window.lucide&&window.lucide.createIcons()}function Qe(t,n){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let o=new Date;o.setMonth(o.getMonth()+n);let e=o.toISOString().slice(0,10);window.gReceiptLines[t].exp_date=e;let a=document.getElementById(`receiptLineExpInput_${t}`);a&&(a.value=e);let i=document.getElementById(`receiptLineExpInputMob_${t}`);i&&(i.value=e);let r=document.getElementById(`receiptExpWarning_${t}`);r&&(r.innerHTML=R(e));let s=document.getElementById(`receiptExpWarningMob_${t}`);s&&(s.innerHTML=R(e)),window.lucide&&window.lucide.createIcons()}function ze(t,n){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].note=n)}function oe(){let t=document.getElementById("createReceiptModal");t&&t.classList.add("hidden")}function Je(){window.gFnbPoList&&window.gFnbPoList.length?ee(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function Ye(){let n=(window.gReceiptLines||[]).filter(g=>(g.actual_qty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let o=new Date;o.setHours(0,0,0,0);let e=!1;for(let g of n)if(g.exp_date){let b=new Date(g.exp_date);if(b.setHours(0,0,0,0),b<=o){e=!0;break}}if(e&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let a=document.getElementById("receiptModalSite")?.value||W(),i=document.getElementById("receiptModalInvoice")?.value||"",r=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),s=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",l=document.getElementById("receiptModalNotes")?.value||"",d=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",c={site_code:a,receipt_date:r,supplier:s,invoice_no:i,notes:l,created_by:d,lines:n.map(g=>({item_code:g.item_code,qty:g.actual_qty,unit_price:g.unit_price,batch_code:(g.batch_code||"").trim(),exp_date:(g.exp_date||"").trim()||null,note:g.note||""}))},u=document.getElementById("btnSubmitReceipt");u&&(u.disabled=!0,u.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let b=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(c)})).json();if(!b.success)throw new Error(b.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${b.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${a} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),oe(),await nt(a),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(a),dt("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(g){console.error("submitCreateReceipt error:",g),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+g.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),u&&(u.disabled=!1,u.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function Ze(t){let n=t||W(),o=document.getElementById("fnbReceiptsTableBody"),e=document.getElementById("fnbReceiptsMobileCards");try{let i=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(n)}&no-cache=1`)).json();if(i.success&&i.data){let r=i.data.receipts||[],s=document.getElementById("fnbReceiptBadgeHistoryCount");s&&(s.textContent=String(r.length)),o&&(r.length?o.innerHTML=r.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${f(l.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${f(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${f(et(l.receipt_date))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${f(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</td>
              <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${f(l.invoice_no||"\u2014")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-3 px-3 text-gray-500 text-xs">${f(l.created_by||"Th\u1EE7 kho")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewReceiptDetail(${l.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):o.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${f(n)}.</td></tr>`),e&&(r.length?e.innerHTML=r.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${f(l.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${f(l.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${f(et(l.receipt_date))} \u2022 PO: ${f(l.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${f(l.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(a){console.error("loadFnbReceiptsHistory error:",a)}}async function tn(t){try{typeof window.showLoading=="function"&&window.showLoading();let o=await(await fetch(`/api/fnb/receipts?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let e=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${t}`),r&&(r.textContent=`${e.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let s=`
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
            ${e.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${f(d.item_name||d.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${f(d.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(d.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${f(d.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${d.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${f(d.exp_date?String(d.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(d.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(d.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${f(d.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=s),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function en(t){let n=t||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||W()||"K001",e=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(h=>h.code.toUpperCase()===n.toUpperCase()),a=e?e.ten||e.name:n,i=a.startsWith(n)?a:`${n} - ${a}`,r=document.getElementById("manualReceiptSiteNameDisplay");r&&(r.textContent=i);let s=document.getElementById("manualReceiptSiteSelect");s&&(s.value=n);let l=document.getElementById("manualReceiptSiteBadge");l&&(l.textContent=n);let d=document.getElementById("manualReceiptDate");d&&(d.value=new Date().toISOString().slice(0,10));let c=document.getElementById("manualReceiptSupplier");c&&!c.value&&(c.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let u=document.getElementById("manualReceiptInvoiceNo");u&&(u.value="");let g=document.getElementById("manualReceiptNotes");g&&(g.value="");let b=document.getElementById("manualItemSearchInput");b&&(b.value="");let y=document.getElementById("manualItemCategorySelect");y&&(y.value=""),window.gManualReceiptLines=[],lt();let p=document.getElementById("modalManualReceipt");p&&p.classList.remove("hidden"),await ht(n,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function ae(){let t=document.getElementById("modalManualReceipt");t&&t.classList.add("hidden")}async function nn(t){let n=document.getElementById("manualReceiptSiteBadge");n&&(n.textContent=t),await ht(t,window.gManualShowAllCatalog)}async function on(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let t=document.getElementById("txtToggleManualCatalog");t&&(t.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let n=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await ht(n,window.gManualShowAllCatalog)}async function ht(t,n){let o=document.getElementById("manualCatalogListContainer");o&&(o.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let e=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}${n?"&include_all=1":""}`,i=await(await fetch(e)).json();i.success&&i.data?window.gManualSiteCatalog=i.data.items||[]:window.gManualSiteCatalog=[],st()}catch(e){console.error("loadManualCatalogItems error:",e),o&&(o.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${f(e.message)}</div>`)}}function st(){let t=document.getElementById("manualCatalogListContainer"),n=document.getElementById("manualCatalogCountText"),o=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),e=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),a=window.gManualSiteCatalog||[];if(o&&(a=a.filter(i=>{let r=(i.code||i.sku||"").toLowerCase(),s=(i.name||"").toLowerCase();return r.includes(o)||s.includes(o)})),e&&(a=a.filter(i=>(i.nhom_hang||i.item_group||i.nganh_hang||"").toLowerCase().includes(e))),n&&(n.textContent=String(a.length)),!!t){if(!a.length){t.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${o?`v\u1EDBi t\u1EEB kh\xF3a "${f(o)}"`:""}.
      </div>
    `;return}t.innerHTML=a.map(i=>{let r=i.code||i.sku,s=(window.gManualReceiptLines||[]).find(c=>c.item_code===r),l=parseFloat(i.book_qty||0),d=parseFloat(i.unit_price||0);return`
      <div onclick="addManualReceiptItem('${r}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${s?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${f(i.name||r)}">
              ${f(i.name||r)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${f(i.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${f(r)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${l>0?"text-emerald-600":"text-gray-500"} font-mono">${l.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${d>0?Math.round(d).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
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
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function an(t){let n=(window.gManualSiteCatalog||[]).find(e=>(e.code||e.sku)===t);if(!n)return;let o=(window.gManualReceiptLines||[]).find(e=>e.item_code===t);if(o)o.qty=Math.round((o.qty+1)*100)/100;else{let a="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),i=new Date;i.setFullYear(i.getFullYear()+1);let r=i.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:n.code||n.sku,item_name:n.name||n.code,unit:n.unit||"Ph\u1EA7n",unit_price:parseFloat(n.unit_price||0),qty:1,batch_code:a,exp_date:r,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}lt(),st()}function lt(){let t=document.getElementById("manualLinesEmptyState"),n=document.getElementById("manualLinesTableWrapper"),o=document.getElementById("manualLinesMobileCards"),e=document.getElementById("btnClearAllManualLines"),a=document.getElementById("manualLinesTableBody"),i=document.getElementById("manualSelectedCountText"),r=document.getElementById("manualSummaryTotalSkus"),s=document.getElementById("manualSummaryTotalQty"),l=document.getElementById("manualSummaryTotalAmount"),d=window.gManualReceiptLines||[];if(i&&(i.textContent=String(d.length)),r&&(r.textContent=d.length+" m\xE3"),!d.length){t&&t.classList.remove("hidden"),n&&(n.classList.add("hidden"),n.classList.remove("lg:block")),o&&(o.classList.add("hidden"),o.classList.remove("block")),e&&(e.classList.add("hidden"),e.classList.remove("flex")),s&&(s.textContent="0"),l&&(l.textContent="0 \u0111");return}t&&t.classList.add("hidden"),n&&(n.classList.remove("hidden"),n.classList.add("lg:block")),o&&(o.classList.remove("hidden"),o.classList.add("block")),e&&(e.classList.remove("hidden"),e.classList.add("flex"));let c=0,u=0;a&&(a.innerHTML=d.map((g,b)=>{let y=(g.qty||0)*(g.unit_price||0);return c+=g.qty||0,u+=y,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${b+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${f(g.item_name)}">
              ${f(g.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${f(g.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${f(g.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${g.qty}" 
                   oninput="onManualLineQtyChange(${b}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${g.unit_price}" 
                   oninput="onManualLinePriceChange(${b}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${b}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${y>0?Math.round(y).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${f(g.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${b}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${g.exp_date||""}" 
                   onchange="onManualLineExpChange(${b}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${f(g.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${b}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${b})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=d.map((g,b)=>{let y=(g.qty||0)*(g.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${b+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${f(g.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${f(g.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${b})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${f(g.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${g.qty}" 
                     oninput="onManualLineQtyChange(${b}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${g.unit_price}" 
                     oninput="onManualLinePriceChange(${b}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${y>0?Math.round(y).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${f(g.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${b}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${g.exp_date||""}" 
                   onchange="onManualLineExpChange(${b}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),s&&(s.textContent=c>0?Number.isInteger(c)?String(c):c.toFixed(1):"0"),l&&(l.textContent=u>0?Math.round(u).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function rn(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=parseFloat(n);window.gManualReceiptLines[t].qty=isNaN(o)?0:o,_t()}function sn(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=parseFloat(n);window.gManualReceiptLines[t].unit_price=isNaN(o)?0:o,_t()}function _t(){let t=0,n=0;(window.gManualReceiptLines||[]).forEach((a,i)=>{let r=(a.qty||0)*(a.unit_price||0);t+=a.qty||0,n+=r;let s=document.getElementById(`manualLineTotal_${i}`);s&&(s.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let o=document.getElementById("manualSummaryTotalQty"),e=document.getElementById("manualSummaryTotalAmount");o&&(o.textContent=t.toFixed(1)),e&&(e.textContent=Math.round(n).toLocaleString("vi-VN")+" \u0111")}function dn(t,n){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].batch_code=n)}function ln(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;window.gManualReceiptLines[t].exp_date=n;let o=document.getElementById(`manualLineExpWarning_${t}`);o&&(o.innerHTML=R(n),window.lucide&&window.lucide.createIcons())}function cn(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=new Date;o.setMonth(o.getMonth()+n);let e=o.toISOString().slice(0,10);window.gManualReceiptLines[t].exp_date=e;let a=document.getElementById(`manualLineExpInput_${t}`);a&&(a.value=e);let i=document.getElementById(`manualLineExpWarning_${t}`);i&&(i.innerHTML=R(e),window.lucide&&window.lucide.createIcons())}function un(t,n){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].storage_loc=n)}function re(t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=window.gManualReceiptLines[t];window.gManualReceiptLines.splice(t,1),lt(),typeof st=="function"&&st(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(n.item_name||n.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function se(){let t=window.gManualReceiptLines||[];if(!t.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let n=document.getElementById("confirmClearManualCountText");n&&(n.textContent=String(t.length));let o=document.getElementById("modalConfirmClearManualLines");o&&(o.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function ie(){let t=document.getElementById("modalConfirmClearManualLines");t&&t.classList.add("hidden")}function pn(){let t=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],ie(),lt(),st(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${t} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function gn(){let n=(window.gManualReceiptLines||[]).filter(y=>(y.qty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let o=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!o){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let e=new Date;e.setHours(0,0,0,0);let a=!1;for(let y of n)if(y.exp_date){let p=new Date(y.exp_date);if(p.setHours(0,0,0,0),p<=e){a=!0;break}}if(a&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let i=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",r=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),s=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",l=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",d=(document.getElementById("manualReceiptNotes")?.value||"").trim(),c=`[${s}] ${d}`.trim(),u=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",g={site_code:i,receipt_date:r,supplier:o,invoice_no:l,notes:c,created_by:u,lines:n.map(y=>({item_code:y.item_code,qty:y.qty,unit_price:y.unit_price,batch_code:(y.batch_code||"").trim(),exp_date:(y.exp_date||"").trim()||null,storage_loc:y.storage_loc||"K\u1EC7 B\u1EBFp",note:y.note||""}))},b=document.getElementById("btnSubmitManualReceipt");b&&(b.disabled=!0,b.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let p=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(g)})).json();if(!p.success)throw new Error(p.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${p.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${i} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),ae(),await nt(i),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(i),dt("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(y){console.error("submitManualReceipt error:",y),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+y.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),b&&(b.disabled=!1,b.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var k=window;k.gFnbReceiptCurrentView=k.gFnbReceiptCurrentView||"po";k.gFnbPoList=k.gFnbPoList||[];k.gReceiptLines=k.gReceiptLines||[];k.gManualReceiptLines=k.gManualReceiptLines||[];k.gManualSiteCatalog=k.gManualSiteCatalog||[];k.gManualShowAllCatalog=k.gManualShowAllCatalog||!1;k.getActiveFnbReceiptSite=W;k.formatReceiptDateYMD=et;k.getReceiptExpWarningHtml=R;k.switchFnbReceiptSubView=dt;k.loadFnbReceipts=qe;k.onFnbPoSearchInput=Ue;k.loadFnbPoList=nt;k.renderFnbPoTable=It;k.openPoReceiptModal=ee;k.renderReceiptLinesTable=ne;k.onReceiptLineQtyChange=Xe;k.onReceiptLineBatchChange=Ke;k.onReceiptLineExpChange=Ge;k.setReceiptLineQuickExp=Qe;k.onReceiptLineNoteChange=ze;k.closeCreateReceiptModal=oe;k.openCreateReceiptModal=Je;k.submitCreateReceipt=Ye;k.loadFnbReceiptsHistory=Ze;k.viewReceiptDetail=tn;k.openManualReceiptModal=en;k.closeManualReceiptModal=ae;k.onManualReceiptSiteChange=nn;k.toggleManualShowAllCatalog=on;k.loadManualCatalogItems=ht;k.filterManualCatalogList=st;k.addManualReceiptItem=an;k.renderManualReceiptLinesTable=lt;k.onManualLineQtyChange=rn;k.onManualLinePriceChange=sn;k.updateManualTotals=_t;k.onManualLineBatchChange=dn;k.onManualLineExpChange=ln;k.setManualLineQuickExp=cn;k.onManualLineLocChange=un;k.removeManualReceiptLine=re;k.removeManualLine=re;k.confirmClearAllManualReceiptLines=se;k.clearAllManualReceiptLines=se;k.closeConfirmClearManualLinesModal=ie;k.executeClearAllManualReceiptLines=pn;k.submitManualReceipt=gn;function P(){let t=document.getElementById("globalBranchSelect")?.value,n=localStorage.getItem("orbit_user_site"),o=window,e=typeof o.App<"u"&&o.App.currentBranch?o.App.currentBranch.toUpperCase():null,a=document.getElementById("fnbWasteFilterSite")?.value,i=t||n||e||a||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function de(){let t=document.getElementById("fnbWasteFilterSite");if(!t)return;let n=t.value||P(),o=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(e=>e.code!=="ALL");if(o&&o.length){let e="";o.forEach(a=>{e+=`<option value="${a.code}" ${a.code.toUpperCase()===n.toUpperCase()?"selected":""}>${a.name}</option>`}),t.innerHTML=e,n&&Array.from(t.options).some(a=>a.value===n)&&(t.value=n)}}function ct(t){let n=document.getElementById("subtab-fnb-waste-stock"),o=document.getElementById("subtab-fnb-waste-history"),e=document.getElementById("fnbWasteSubViewStock"),a=document.getElementById("fnbWasteSubViewHistory");t==="history"?(n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),e&&e.classList.add("hidden"),a&&a.classList.remove("hidden")):(n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),e&&e.classList.remove("hidden"),a&&a.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function le(t){let n=t||P(),o=document.getElementById("fnbWasteTableBody"),e=document.getElementById("fnbWasteMobileCards"),a=document.getElementById("fnbWasteBadgeHistoryCount");try{let r=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(n)}&no-cache=1`)).json();if(r.success&&r.data){let s=r.data.wastes||[];a&&(a.textContent=String(s.length)),o&&(s.length?o.innerHTML=s.map(l=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${f(l.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${f(l.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${f(String(l.waste_date||"").slice(0,10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${f(l.reason||"H\xE0ng h\u1ECFng")}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${f(l.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u20AB</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${f(l.notes||"\u2014")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${l.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi ti\u1EBFt">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):o.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${f(n)}.</td></tr>`),e&&(s.length?e.innerHTML=s.map(l=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${f(l.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${f(l.reason||"H\xE0ng h\u1ECFng")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y: ${f(String(l.waste_date||"").slice(0,10))} \u2022 \u0110i\u1EC3m: ${f(l.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(l.total_amount||0).toLocaleString("vi-VN")} \u20AB</span>
                  <span class="text-xs text-gray-400">${f(l.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</span>
                </div>
              </div>
            </div>
          `).join(""):e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(i){console.error("loadFnbWasteHistory error:",i)}}async function mn(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let o=await(await fetch(`/api/fnb/wastes?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let e=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${t}`),r&&(r.textContent=`${e.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let s=`
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
            ${e.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${f(d.item_name||d.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${f(d.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${f(d.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(d.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(d.unit_price).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(d.amount).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${f(d.reason_detail||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=s),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function ce(){let t=document.getElementById("fnbWasteNganhHangFilter"),n=document.getElementById("fnbWasteNhomHangFilter");if(!t||!n)return;let o=new Map;(window.gFnbWasteStockItems||[]).forEach(a=>{let i=(a.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),r=(a.nhom_hang||a.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();o.has(i)||o.set(i,new Set),o.get(i).add(r)}),window.gFnbWasteNganhMap=o;let e='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(o.keys()).sort().forEach(a=>{e+=`<option value="${f(a)}">${f(a)}</option>`}),t.innerHTML=e,t.value="",Mt("")}function Mt(t){let n=document.getElementById("fnbWasteNhomHangFilter");if(!n)return;let o=new Set;window.gFnbWasteNganhMap&&(t&&window.gFnbWasteNganhMap.has(t)?window.gFnbWasteNganhMap.get(t).forEach(a=>o.add(a)):window.gFnbWasteNganhMap.forEach(a=>a.forEach(i=>o.add(i))));let e='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(o).sort().forEach(a=>{e+=`<option value="${f(a)}">${f(a)}</option>`}),n.innerHTML=e,n.value=""}function fn(){let t=document.getElementById("fnbWasteNganhHangFilter")?.value||"";Mt(t),ut()}function hn(){ut()}function bn(t){ut()}function yn(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function ut(){let t=document.getElementById("fnbWasteStockTableBody"),n=document.getElementById("fnbWasteStockMobileCards"),o=document.getElementById("fnbWasteStockEmptyState"),e=document.getElementById("fnbWasteSummary"),a=document.getElementById("fnbWasteBadgeInStockCount"),i=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),r=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),s=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),l=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),d=window.gFnbWasteStockItems||[],c=document.getElementById("kpiWasteInStockCount"),u=document.getElementById("kpiWasteInStockVal");c&&(c.textContent=String(d.length));let g=0;if(d.forEach(p=>{g+=Number(p.total_value)||Number(p.book_qty)*Number(p.unit_price)||0}),u){let p=Zt(g);u.innerHTML=`${p.val}<span class="kpi-unit">${p.unit}</span>`}a&&(a.textContent=String(d.length));let b=d.filter(p=>{if(s==="EXP"&&(p.days_remaining!==void 0?Number(p.days_remaining):999)>15&&!p.is_expired||i&&(p.nganh_hang||"").trim().toLowerCase()!==i||r&&(p.nhom_hang||p.item_group||"").trim().toLowerCase()!==r)return!1;if(l){let h=(p.name||"").toLowerCase(),m=(p.code||"").toLowerCase();if(!h.includes(l)&&!m.includes(l))return!1}return!0});if(e&&(e.textContent=`Hi\u1EC3n th\u1ECB ${b.length} / ${d.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),$t(),!b.length){t&&(t.innerHTML=""),n&&(n.innerHTML=""),o&&o.classList.remove("hidden");return}o&&o.classList.add("hidden");let y=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];t&&(t.innerHTML=b.map((p,h)=>{let m=Number(p.book_qty)||0,w=Number(p.unit_price)||0,x=Number(p.total_value)||m*w,v=p.wasteQty||0,C=v*w;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${h+1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${f(p.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${f(p.name||p.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${f(p.nganh_hang||p.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
              ${p.nhom_hang&&p.nhom_hang!==p.nganh_hang?`<span>\u2022</span><span>${f(p.nhom_hang)}</span>`:""}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${f(p.unit||"Ph\u1EA7n")}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(w).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${m.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(x).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${m}" value="${v>0?v:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${f(p.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${f(p.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${y.map(I=>`<option value="${f(I)}" ${p.wasteReason===I?"selected":""}>${f(I)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${f(p.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${C>0?Math.round(C).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${f(p.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${f(p.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=b.map(p=>{let h=Number(p.book_qty)||0,m=Number(p.unit_price)||0,w=p.wasteQty||0,x=w*m;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${f(p.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${f(p.name||p.code)}</h4>
              <div class="text-xs text-gray-400">${f(p.nganh_hang||p.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${h.toFixed(1)} ${f(p.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(m).toLocaleString("vi-VN")} \u20AB / ${f(p.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${h.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${h}" value="${w>0?w:""}" placeholder="0"
                     oninput="onWasteLineQtyChange('${f(p.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Th\xE0nh Ti\u1EC1n H\u1EE7y</label>
              <div id="mobWasteLineTotal_${f(p.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${x>0?Math.round(x).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">L\xFD Do H\u1EE7y</label>
            <select onchange="onWasteLineReasonChange('${f(p.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${y.map(v=>`<option value="${f(v)}" ${p.wasteReason===v?"selected":""}>${f(v)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function xn(t,n){let o=(window.gFnbWasteStockItems||[]).find(l=>l.code===t);if(!o)return;let e=parseFloat(n),a=Number(o.book_qty)||0;isNaN(e)||e<0?o.wasteQty=0:e>a?(o.wasteQty=a,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${a})`)):o.wasteQty=e;let i=o.wasteQty*(Number(o.unit_price)||0),r=document.getElementById(`wasteLineTotal_${t}`);r&&(r.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let s=document.getElementById(`mobWasteLineTotal_${t}`);s&&(s.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),$t()}function wn(t,n){let o=(window.gFnbWasteStockItems||[]).find(e=>e.code===t);o&&(o.wasteReason=n)}function vn(t,n){let o=(window.gFnbWasteStockItems||[]).find(e=>e.code===t);o&&(o.wasteNote=n)}function $t(){let t=window.gFnbWasteStockItems||[],n=0,o=0;t.forEach(s=>{s.wasteQty>0&&(n++,o+=s.wasteQty*(Number(s.unit_price)||0))});let e=document.getElementById("kpiWasteSelectedCount");e&&(e.textContent=String(n));let a=document.getElementById("kpiWasteTotalEstAmount");if(a)if(o>0){let s=Zt(o);a.innerHTML=`${s.val}<span class="kpi-unit">${s.unit}</span>`}else a.textContent="0 \u20AB";let i=document.getElementById("btnSubmitDirectWaste"),r=document.getElementById("btnSubmitDirectWasteText");i&&(i.disabled=n===0),r&&(r.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${n})`)}async function kn(){let n=(window.gFnbWasteStockItems||[]).filter(l=>(l.wasteQty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let o=P(),e=new Date().toISOString().slice(0,10),a=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",i=0;n.forEach(l=>{i+=l.wasteQty*(Number(l.unit_price)||0)});let r={site_code:o,waste_date:e,reason:n.length===1?n[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:a,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${n.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:a,lines:n.map(l=>({item_code:l.code,qty:l.wasteQty,unit_price:Number(l.unit_price)||0,reason_detail:l.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:l.wasteNote||""}))},s=document.getElementById("btnSubmitDirectWaste");s&&(s.disabled=!0,s.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let d=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(!d.success)throw new Error(d.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${d.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${o} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),ct("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(l){console.error("submitDirectWaste error:",l),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+l.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),s&&(s.disabled=!1,s.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function Ln(){let t=document.getElementById("createWasteModal"),n=P(),o=document.getElementById("wasteModalSite"),e=document.getElementById("wasteModalDate");if(e&&!e.value&&(e.value=new Date().toISOString().slice(0,10)),o){let i="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(r=>{i+=`<option value="${r.code}" ${r.code===n?"selected":""}>${r.ten||r.name}</option>`}),o.innerHTML=i,o.value=n}await Bt(n);let a=document.getElementById("wasteLinesContainer");a&&(a.innerHTML=""),Ht(),t&&t.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function ue(){let t=document.getElementById("createWasteModal");t&&t.classList.add("hidden")}async function Sn(){let t=document.getElementById("wasteModalSite")?.value||"K001";await Bt(t);let n=document.getElementById("wasteLinesContainer");n&&(n.innerHTML=""),Ht()}async function Bt(t){try{let o=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=o.success&&o.data?o.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function Ht(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let n=window.gWasteModalInStockItems||[],o="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),e='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';n.forEach(i=>{e+=`<option value="${f(i.code)}" data-price="${i.unit_price}" data-unit="${f(i.unit||"")}" data-stock="${i.book_qty}">[${f(i.code)}] ${f(i.name)} (T\u1ED3n: ${Number(i.book_qty).toFixed(1)} ${f(i.unit||"")})</option>`});let a=`
    <div id="${o}" class="p-3 rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/30 space-y-2">
      <div class="flex items-center justify-between gap-2">
        <select onchange="onWasteModalItemSelect('${o}', this)" class="w-full py-1.5 px-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-semibold outline-none focus:border-rose-500">
          ${e}
        </select>
        <button type="button" onclick="document.getElementById('${o}')?.remove(); recalculateWasteModalTotal();" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors">
          <i data-lucide="trash-2" class="w-4 h-4"></i>
        </button>
      </div>
      <div class="grid grid-cols-3 gap-2">
        <div>
          <label class="block text-xs text-gray-500 mb-0.5">SL H\u1EE7y</label>
          <input type="number" step="0.01" min="0" placeholder="0" oninput="onWasteModalLineQtyInput('${o}', this.value)" class="waste-modal-qty w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-bold tabular-nums text-center outline-none focus:border-rose-500 font-mono">
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
  `;t.insertAdjacentHTML("beforeend",a),window.lucide&&window.lucide.createIcons()}function Cn(t,n){let o=document.getElementById(t);if(!o)return;let e=n.options[n.selectedIndex],a=Number(e?.getAttribute("data-price"))||0,i=Number(e?.getAttribute("data-stock"))||0,r=o.querySelector(".waste-modal-price");r&&(r.textContent=Math.round(a).toLocaleString("vi-VN")+" \u20AB");let s=o.querySelector(".waste-modal-qty");s&&(s.max=String(i),s.placeholder=`T\u1ED1i \u0111a ${i.toFixed(1)}`),pe(t,s?s.value:"0")}function pe(t,n){let o=document.getElementById(t);if(!o)return;let e=o.querySelector("select"),a=e?.options[e.selectedIndex],i=Number(a?.getAttribute("data-price"))||0,s=(parseFloat(n)||0)*i,l=o.querySelector(".waste-modal-amt");l&&(l.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),ge()}function ge(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let n=0;t.querySelectorAll(".p-3").forEach(e=>{let a=e.querySelector("select"),i=a?.options[a.selectedIndex],r=Number(i?.getAttribute("data-price"))||0,s=e.querySelector(".waste-modal-qty"),l=parseFloat(s?.value||"0")||0;n+=l*r});let o=document.getElementById("wasteModalTotalAmount");o&&(o.textContent=n>0?Math.round(n).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function En(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let n=[];if(t.querySelectorAll(".p-3").forEach(c=>{let u=c.querySelector("select"),g=u?.value,b=u?.options[u.selectedIndex],y=Number(b?.getAttribute("data-price"))||0,p=c.querySelector(".waste-modal-qty"),h=parseFloat(p?.value||"0")||0;g&&h>0&&n.push({item_code:g,qty:h,unit_price:y,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let o=document.getElementById("wasteModalSite")?.value||P(),e=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),a=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",i=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",r=document.getElementById("wasteModalNotes")?.value||"",s=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",l={site_code:o,waste_date:e,reason:a,confirmed_by:i,notes:r,created_by:s,lines:n},d=document.getElementById("btnSubmitWaste");d&&(d.disabled=!0,d.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let u=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(l)})).json();if(!u.success)throw new Error(u.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${u.data.waste_code}!`),ue(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),ct("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(c){console.error("submitCreateWaste error:",c),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+c.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),d&&(d.disabled=!1,d.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function qo(){de();let t=P(),n=document.getElementById("fnbWasteFilterSite");n&&n.value!==t&&(n.value=t);let o=document.getElementById("fnbWasteSummary");o&&(o.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+t+"...");try{let a=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();a.success&&a.data?window.gFnbWasteStockItems=(a.data.items||[]).map(i=>({...i,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],ce(),ut(),le(t)}catch(e){console.error("loadFnbWaste error:",e),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+e.message)}}var S=window;S.gFnbWasteStockItems=S.gFnbWasteStockItems||[];S.gFnbWasteNganhMap=S.gFnbWasteNganhMap||null;S.gWasteModalInStockItems=S.gWasteModalInStockItems||[];S.getActiveFnbWasteSite=P;S.populateFnbWasteSiteDropdown=de;S.loadFnbWaste=qo;S.switchFnbWasteSubView=ct;S.populateFnbWasteFilters=ce;S.populateFnbWasteNhomHangDropdown=Mt;S.onFnbWasteNganhHangChange=fn;S.onFnbWasteFilterChange=hn;S.onFnbWasteSearch=bn;S.onFnbWasteSiteChange=yn;S.renderFnbWasteStockTable=ut;S.onWasteLineQtyChange=xn;S.onWasteLineReasonChange=wn;S.onWasteLineNoteChange=vn;S.updateWasteKPIs=$t;S.submitDirectWaste=kn;S.loadFnbWasteHistory=le;S.viewWasteDetail=mn;S.openCreateWasteModal=Ln;S.closeCreateWasteModal=ue;S.onWasteModalSiteChange=Sn;S.loadWasteModalItems=Bt;S.addWasteLineRow=Ht;S.onWasteModalItemSelect=Cn;S.onWasteModalLineQtyInput=pe;S.recalculateWasteModalTotal=ge;S.submitCreateWaste=En;function X(){let t=localStorage.getItem("orbit_user_site"),n=document.getElementById("globalBranchSelect")?.value,o=window,e=typeof o.App<"u"&&o.App.currentBranch?o.App.currentBranch.toUpperCase():null,a=document.getElementById("fnbCountSiteSelect")?.value,i=t||n||e||a||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function Nt(){let t=document.getElementById("fnbCountNganhHangFilter"),n=document.getElementById("fnbCountNhomHangFilter");if(!t||!n)return;let o=new Map;(window.gFnbAllItems||[]).forEach(i=>{let r=(i.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),s=(i.nhom_hang||i.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();o.has(r)||o.set(r,new Set),o.get(r).add(s)}),window.gFnbNganhMap=o;let a='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(o.keys()).sort().forEach(i=>{a+=`<option value="${f(i)}">${f(i)}</option>`}),t.innerHTML=a,t.value="",Ft("")}function Ft(t){let n=document.getElementById("fnbCountNhomHangFilter");if(!n)return;let o=new Set;window.gFnbNganhMap&&(t&&window.gFnbNganhMap.has(t)?window.gFnbNganhMap.get(t).forEach(a=>o.add(a)):window.gFnbNganhMap.forEach(a=>a.forEach(i=>o.add(i))));let e='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(o).sort().forEach(a=>{e+=`<option value="${f(a)}">${f(a)}</option>`}),n.innerHTML=e,n.value=""}function Tn(){let t=document.getElementById("fnbCountNganhHangFilter")?.value||"";Ft(t),j()}function In(){j()}function _n(t){j()}function Mn(){j()}function $n(){let t=document.getElementById("fnbCountSiteSelect");if(t&&t.value&&t.value!=="all"){try{localStorage.setItem("orbit_user_site",t.value)}catch{}let n=document.getElementById("globalBranchSelect");n&&(n.value=t.value)}typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}function Bn(t){window.gFnbBlindCount=t,j()}function Hn(t,n){let o=(window.gCurrentCountItems||[]).find(e=>e.code===t);o&&(o.userCount=n===""?0:Number(n),j())}function Nn(t,n){let o=(window.gCurrentCountItems||[]).find(e=>e.code===t);o&&(o.userNote=n)}function j(){let t=document.getElementById("fnbCountsTableBody"),n=document.getElementById("fnbCountsMobileCards"),o=(document.getElementById("fnbCountNganhHangFilter")?.value||"").trim().toLowerCase(),e=(document.getElementById("fnbCountNhomHangFilter")?.value||"").trim().toLowerCase(),a=document.getElementById("fnbCountStatusFilter")?.value||"all",i=(document.getElementById("fnbCountSearchInput")?.value||"").trim().toLowerCase(),r=window.gFnbAllItems||[],s=r.filter(p=>{if(o&&(p.nganh_hang||"").trim().toLowerCase()!==o||e&&(p.nhom_hang||p.item_group||"").trim().toLowerCase()!==e)return!1;if(a!=="all"){let h=Number(p.book_qty)||0,w=(p.userCount!==void 0?Number(p.userCount):p.last_count_qty!==null&&p.last_count_qty!==void 0?Number(p.last_count_qty):h)-h,x=p.userCount!==void 0||p.last_count_qty!==null;if(a==="diff"&&Math.abs(w)<.001||a==="matched"&&Math.abs(w)>=.001||a==="counted"&&!x||a==="uncounted"&&x)return!1}if(i){let h=(p.name||"").toLowerCase(),m=(p.code||"").toLowerCase(),w=(p.nganh_hang||"").toLowerCase(),x=(p.nhom_hang||"").toLowerCase();if(!h.includes(i)&&!m.includes(i)&&!w.includes(i)&&!x.includes(i))return!1}return!0});window.gCurrentCountItems=s;let l=0,d=0,c=0;s.forEach(p=>{let h=Number(p.book_qty)||0,m=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:h,x=(Number(m)||0)-h,v=x*(Number(p.unit_price)||0);Math.abs(x)<.001?l++:d++,c+=v});let u=document.getElementById("fnbCountMetricTotal");u&&(u.textContent=String(s.length));let g=document.getElementById("fnbCountMetricMatched");g&&(g.textContent=String(l));let b=document.getElementById("fnbCountMetricDiff");b&&(b.textContent=String(d));let y=document.getElementById("fnbCountMetricDiffVal");y&&(y.textContent=(c>0?"+":"")+Math.round(c).toLocaleString("vi-VN")+" \u0111"),t&&(s.length===0?!r||r.length===0?t.innerHTML=`<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
            <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nh\u1EADp H\xE0ng \u0110i\u1EC3m B\xE1n</a> tr\u01B0\u1EDBc khi th\u1EF1c hi\u1EC7n ki\u1EC3m k\xEA.</p>
          </div>
        </td></tr>`:t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>':t.innerHTML=s.map((p,h)=>{let m=Number(p.book_qty)||0,w=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:m,x=Number(w)||0,v=x-m,C=v*(Number(p.unit_price)||0),I='<span class="text-gray-400 tabular-nums">0</span>';v>0?I=`<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${v.toFixed(1)}</span>`:v<0&&(I=`<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${v.toFixed(1)}</span>`);let F='<span class="text-gray-400 tabular-nums font-mono">0 \u0111</span>';C>0?F=`<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(C).toLocaleString("vi-VN")} \u0111</span>`:C<0&&(F=`<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(C).toLocaleString("vi-VN")} \u0111</span>`);let Et=window.gFnbBlindCount?'<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">\u2022\u2022\u2022\u2022</span>':`<span class="font-bold tabular-nums font-mono ${m<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${m.toFixed(1)}</span>`,it=p.nhom_hang||p.item_group||"";return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${h+1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${f(p.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${f(p.code)}</span>
                ${it?`<span>\u2022</span><span class="text-gray-500 dark:text-gray-400">${f(it)}</span>`:""}
                <span>\u2022</span>
                <span class="font-mono">Gi\xE1: ${Number(p.unit_price).toLocaleString("vi-VN")} \u0111</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${f(p.unit||"")}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${Et}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${x}" oninput="onCountInputChange('${f(p.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${I}</td>
            <td class="py-3 px-3 text-right select-all">${F}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="L\xFD do ch\xEAnh l\u1EC7ch (n\u1EBFu c\xF3)..." value="${f(p.userNote||"")}" oninput="onCountNoteChange('${f(p.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `}).join("")),n&&(s.length===0?!r||r.length===0?n.innerHTML=`<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
          <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nh\u1EADp H\xE0ng</a> tr\u01B0\u1EDBc khi ki\u1EC3m k\xEA.</p>
        </div>`:n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':n.innerHTML=s.map(p=>{let h=Number(p.book_qty)||0,m=p.userCount!==void 0?p.userCount:p.last_count_qty!==null&&p.last_count_qty!==void 0?p.last_count_qty:h,w=Number(m)||0,x=w-h,v=x*(Number(p.unit_price)||0);return`
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${f(p.nhom_hang||p.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${f(p.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${f(p.code)}</span> \u2022 ${Number(p.unit_price).toLocaleString("vi-VN")} \u0111/${f(p.unit||"")}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">T\u1ED3n s\xE1ch:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${h<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${window.gFnbBlindCount?"\u2022\u2022\u2022\u2022":h.toFixed(1)} ${f(p.unit||"")}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">SL Th\u1EF1c t\u1EBF:</span>
                <input type="number" step="0.1" value="${w}" oninput="onCountInputChange('${f(p.code)}', this.value)"
                       class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 font-bold tabular-nums text-gray-900 dark:text-white outline-none font-mono">
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-0.5">Ch\xEAnh l\u1EC7ch:</span>
                <div class="font-bold text-xs pt-1.5 tabular-nums font-mono ${x>0?"text-emerald-600":x<0?"text-rose-600":"text-gray-400"}">
                  ${x>0?"+":""}${x.toFixed(1)} (${(v>0?"+":"")+Math.round(v).toLocaleString("vi-VN")} \u0111)
                </div>
              </div>
            </div>

            <input type="text" placeholder="Ghi ch\xFA l\xFD do..." value="${f(p.userNote||"")}" oninput="onCountNoteChange('${f(p.code)}', this.value)"
                   class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none">
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function Fn(){let t=X(),n=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),o="DAILY",e=window.gCurrentCountItems||[];if(!e||!e.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 l\u01B0u ki\u1EC3m k\xEA!");return}let a=e.map(r=>{let s=Number(r.book_qty)||0,l=r.userCount!==void 0?Number(r.userCount):r.last_count_qty!==null&&r.last_count_qty!==void 0?Number(r.last_count_qty):s,d=l-s,c=d*(Number(r.unit_price)||0);return{item_code:r.code,item_name:r.name,item_group:r.item_group||r.nhom_hang||"NVL",unit:r.unit,unit_price:Number(r.unit_price)||0,book_qty:s,actual_qty:l,count_qty:l,diff_qty:d,diff_value:c,diff_val:c,note:r.userNote||""}}),i={site_code:t,count_date:n,count_type:o,notes:`Ki\u1EC3m k\xEA h\u1EB1ng ng\xE0y \u0111i\u1EC3m ${t}`,lines:a};try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA...");let s=await(await fetch("/api/fnb/counts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();if(!s.success)throw new Error(s.error||"L\u1ED7i khi l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA");typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA ${s.data.count_code} th\xE0nh c\xF4ng!`),typeof window.loadFnbCounts=="function"&&await window.loadFnbCounts()}catch(r){console.error("saveFnbCountAudit error:",r),typeof window.showToast=="function"&&window.showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+r.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function me(t){let n=t||X();try{let e=await(await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(n)}`)).json(),a=document.getElementById("fnbCountsHistoryBody"),i=document.getElementById("fnbCountsHistoryMobileCards");if((a||i)&&e.success){let r=e.data.counts||[];r.length?(a&&(a.innerHTML=r.map(s=>`
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${s.id})">${f(s.count_code)}</td>
              <td class="py-2.5 px-3 font-semibold">${f(s.site_code)}</td>
              <td class="py-2.5 px-3 tabular-nums">${f(s.count_date)}</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${s.count_type==="DAILY"?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"}">${s.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span></td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono">${s.total_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono ${s.diff_items>0?"text-rose-600 font-bold":"text-emerald-600"}">${s.diff_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${s.diff_value>0||s.diff_value<0?"text-rose-600":"text-emerald-600"}">${Math.round(s.diff_value).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-2.5 px-3 text-gray-400">${f(s.notes||"\u2014")}</td>
            </tr>
          `).join("")),i&&(i.innerHTML=r.map(s=>`
            <div class="data-card cursor-pointer p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2" onclick="viewCountDetail(${s.id})">
              <div class="data-card-header flex items-center justify-between">
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">${f(s.count_code)}</span>
                <span class="badge ${s.count_type==="DAILY"?"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300":"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"} text-xs px-2 py-0.5 rounded-full font-bold">${s.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span>
              </div>
              <div class="data-card-body space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">\u0110i\u1EC3m b\xE1n: <b class="text-gray-700 dark:text-gray-200">${f(s.site_code)}</b></span>
                  <span class="num text-gray-500">${s.count_date}</span>
                </div>
                <div class="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                  <div>
                    <span class="text-gray-400 block text-[11px]">T\u1ED5ng m\xF3n</span>
                    <span class="num font-semibold text-gray-900 dark:text-white font-mono">${s.total_items||0}</span>
                  </div>
                  <div>
                    <span class="text-gray-400 block text-[11px]">S\u1ED1 l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(s.diff_items)>0?"text-rose-600 dark:text-rose-400":"text-emerald-600"}">${s.diff_items||0}</span>
                  </div>
                  <div class="text-right">
                    <span class="text-gray-400 block text-[11px]">Gi\xE1 tr\u1ECB l\u1EC7ch</span>
                    <span class="num font-semibold font-mono ${Number(s.diff_value)!==0?"text-rose-600 dark:text-rose-400":"text-gray-900 dark:text-white"}">${Math.round(Number(s.diff_value)||0).toLocaleString("vi-VN")} \u20AB</span>
                  </div>
                </div>
              </div>
            </div>
          `).join(""))):(a&&(a.innerHTML=`<tr><td colspan="8" class="text-center py-6 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${f(n)}.</td></tr>`),i&&(i.innerHTML=`<div class="card p-6 text-center text-gray-400 text-sm">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${f(n)}.</div>`))}}catch(o){console.error("loadFnbCountsHistory error:",o)}}async function Dn(t){try{typeof window.showLoading=="function"&&window.showLoading();let o=await(await fetch(`/api/fnb/counts?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu");let e=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Ki\u1EC3m K\xEA #${t}`),r&&(r.textContent=`${e.length} m\u1EB7t h\xE0ng ki\u1EC3m k\xEA`);let s=`
      <div class="overflow-x-auto">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-800 text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th class="py-2 px-3">M\u1EB7t H\xE0ng</th>
              <th class="py-2 px-3 text-right">T\u1ED3n S\xE1ch</th>
              <th class="py-2 px-3 text-right">SL \u0110\u1EBFm</th>
              <th class="py-2 px-3 text-right">L\u1EC7ch</th>
              <th class="py-2 px-3 text-right">Ti\u1EC1n L\u1EC7ch</th>
              <th class="py-2 px-3">Ghi Ch\xFA</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800/60 tabular-nums">
            ${e.map(d=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${f(d.item_name||d.item_code)}</td>
                <td class="py-2 px-3 text-right font-mono">${d.book_qty}</td>
                <td class="py-2 px-3 text-right font-bold text-blue-600 font-mono">${d.count_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${d.diff_qty<0?"text-rose-600":d.diff_qty>0?"text-emerald-600":"text-gray-400"}">${d.diff_qty>0?"+":""}${d.diff_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${d.diff_val<0?"text-rose-600":d.diff_val>0?"text-emerald-600":"text-gray-400"}">${d.diff_val>0?"+":""}${Math.round(d.diff_val).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${f(d.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,l=document.getElementById("invDetailModalBody");l&&(l.innerHTML=s),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Rn(){document.getElementById("invDetailModal")?.classList.add("hidden")}function An(){let t=window.gCurrentCountItems||[];if(!t||!t.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t phi\u1EBFu ki\u1EC3m!");return}let n=X(),o=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),a=[["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)","T\u1ED3n S\u1ED5 S\xE1ch","S\u1ED1 \u0110\u1EBFm Th\u1EF1c T\u1EBF","Ch\xEAnh L\u1EC7ch","Ghi Ch\xFA"]];if(t.forEach((l,d)=>{let c=Number(l.book_qty)||0,u=l.userCount!==void 0?Number(l.userCount):l.last_count_qty!==null&&l.last_count_qty!==void 0?Number(l.last_count_qty):c,g=u-c;a.push([d+1,l.code,l.name,l.nganh_hang||"",l.nhom_hang||l.item_group||"",l.unit,Number(l.unit_price)||0,c,u,g,l.userNote||""])}),typeof XLSX>"u"){typeof window.showToast=="function"&&window.showToast("Th\u01B0 vi\u1EC7n XLSX ch\u01B0a s\u1EB5n s\xE0ng!");return}let i=XLSX.utils.aoa_to_sheet(a);i["!cols"]=[{wch:6},{wch:15},{wch:32},{wch:20},{wch:22},{wch:8},{wch:14},{wch:14},{wch:16},{wch:14},{wch:25}],i["!autofilter"]={ref:`A1:K${a.length}`},i["!views"]=[{state:"frozen",ySplit:1,xSplit:0}];let r=XLSX.utils.decode_range(i["!ref"]||"A1:K1");for(let l=r.s.r;l<=r.e.r;++l)for(let d=r.s.c;d<=r.e.c;++d){let c=XLSX.utils.encode_cell({r:l,c:d});if(i[c])if(l===0)i[c].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:d===0||d===1?"center":d>=6&&d<=9?"right":"left",wrapText:!1}};else{let u=d===0||d>=6&&d<=9,g=d===1||d===5;i[c].s={font:{name:"Aptos",sz:11,regular:!0,color:{rgb:"000000"}},alignment:{vertical:"center",horizontal:u?"right":g?"center":"left"}}}}let s=XLSX.utils.book_new();XLSX.utils.book_append_sheet(s,i,"PhieuKiemKe"),XLSX.writeFile(s,`Phieu_Kiem_Ke_${n}_${o}.xlsx`),typeof window.showToast=="function"&&window.showToast("\u0110\xE3 xu\u1EA5t phi\u1EBFu ki\u1EC3m k\xEA Excel theo quy chu\u1EA9n Aptos!")}async function Uo(){let t=X(),n=document.getElementById("fnbCountSiteSelect");n&&n.value!==t&&(n.value=t);let e=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(s=>s.code.toUpperCase()===t.toUpperCase()),a=e?e.ten||e.name:t,i=document.getElementById("fnbCountCurrentSiteBadge");i&&(i.textContent=a);let r=document.getElementById("fnbCountDatePicker");r&&!r.value&&(r.value=new Date().toISOString().slice(0,10));try{typeof window.showLoading=="function"&&window.showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA c\u1EE7a "+t+"...");let l=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();l.success&&l.data?(window.gFnbAllItems=l.data.items||[],Nt(),j()):(window.gFnbAllItems=[],Nt(),j()),me(t)}catch(s){console.error("loadFnbCounts error:",s),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u ki\u1EC3m k\xEA: "+s.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}var T=window;T.gFnbAllItems=T.gFnbAllItems||[];T.gCurrentCountItems=T.gCurrentCountItems||[];T.gFnbBlindCount=T.gFnbBlindCount||!1;T.gFnbNganhMap=T.gFnbNganhMap||null;T.getActiveFnbCountSite=X;T.loadFnbCounts=Uo;T.populateFnbCountFilters=Nt;T.populateFnbCountNhomHangDropdown=Ft;T.onFnbCountNganhHangChange=Tn;T.onFnbCountFilterChange=In;T.onFnbCountSearch=_n;T.onFnbCountDateChange=Mn;T.onFnbCountSiteChange=$n;T.toggleBlindCount=Bn;T.onCountInputChange=Hn;T.onCountNoteChange=Nn;T.renderFnbCountsTable=j;T.saveFnbCountAudit=Fn;T.loadFnbCountsHistory=me;T.viewCountDetail=Dn;T.closeInvDetailModal=Rn;T.exportCountSheetExcel=An;function Dt(t){if(!t||!t.rows||t.rows.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}try{let n=t.sites||[],o=t.rows||[],e=t.groups||{},a=["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)"];n.forEach(u=>{a.push(u.ten||u.name||u.code)});let i=[a];o.forEach((u,g)=>{let b=e[u.group]||u.group,y=[g+1,u.code,u.name,b,u.unit,u.price||0];n.forEach(p=>{let h=u.cells?u.cells[p.id]:void 0;y.push(h&&h.book||0)}),i.push(y)});let r=XLSX.utils.aoa_to_sheet(i),s=XLSX.utils.decode_range(r["!ref"]),l=[{wch:6},{wch:14},{wch:32},{wch:18},{wch:8},{wch:14}];n.forEach(()=>l.push({wch:16})),r["!cols"]=l;for(let u=s.s.r;u<=s.e.r;++u)for(let g=s.s.c;g<=s.e.c;++g){let b=XLSX.utils.encode_cell({r:u,c:g});if(!r[b])continue;if(u===0)r[b].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"CCCCCC"}},bottom:{style:"medium",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"CCCCCC"}},right:{style:"thin",color:{rgb:"CCCCCC"}}}};else{let p="left",h;g===0||g===1||g===4?p="center":(g===5||g>=6)&&(p="right",h="#,##0.00");let m=g>=6&&typeof r[b].v=="number"&&r[b].v<0;r[b].s={font:{name:"Aptos",sz:11,bold:m,color:{rgb:m?"C00000":"000000"}},alignment:{horizontal:p,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E5E5E5"}},bottom:{style:"thin",color:{rgb:"E5E5E5"}},left:{style:"thin",color:{rgb:"E5E5E5"}},right:{style:"thin",color:{rgb:"E5E5E5"}}}},h&&typeof r[b].v=="number"&&(r[b].z=h)}}r["!autofilter"]={ref:r["!ref"]},r["!freeze"]={xSplit:3,ySplit:1,topLeftCell:"D2",activePane:"bottomRight",state:"frozen"};let d=XLSX.utils.book_new();XLSX.utils.book_append_sheet(d,r,"T\u1ED3n Kho Chu\u1ED7i F&B");let c=new Date().toISOString().slice(0,10).replace(/-/g,"");XLSX.writeFile(d,`Ton_Kho_F&B_Chuoi_${c}.xlsx`),typeof showToast=="function"&&showToast("Xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho F&B th\xE0nh c\xF4ng (Font Aptos)!")}catch(n){console.error("Export Excel error:",n),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+(n?.message||n))}}var V=null,$={site:"ALL",group:"ALL",search:"",showValue:!1},Rt="";async function fe(){try{typeof showLoading=="function"&&showLoading();let t=new URL("/api/fnb/stock",window.location.origin);$.site&&$.site!=="ALL"&&$.site!=="all"&&t.searchParams.set("site_code",$.site),$.region&&$.region!=="ALL"&&t.searchParams.set("regionId",$.region),$.group&&$.group!=="ALL"&&t.searchParams.set("group",$.group),t.searchParams.set("refresh","true");let o=await(await fetch(t.toString())).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c d\u1EEF li\u1EC7u t\u1ED3n kho F&B");V=o.data,window.gFnbStockData=V,bt()}catch(t){console.error("Error loadFnbStock:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i t\u1ED3n kho F&B: "+(t?.message||t))}finally{typeof hideLoading=="function"&&hideLoading()}}function bt(){if(!V)return;let t=V.sites||[],n=V.rows||[],o=V.groups||{},e=(Rt||"").trim().toLowerCase(),a=n.filter(m=>{if(!e)return!0;let w=(m.name||"").toLowerCase().includes(e),x=(m.code||"").toLowerCase().includes(e);return w||x}),i=$.site,r=a;i&&i!=="ALL"&&i!=="all"&&(r=a.filter(m=>{let w=m.cells&&m.cells[i];return w&&(w.hasSiteRecord||w.book!==void 0&&Number(w.book)!==0||w.lastCount!==null&&w.lastCount!==void 0)}));let s=0,l=0,d=0;a.forEach(m=>{t.forEach(w=>{let x=m.cells&&m.cells[w.id];if(x){let v=Number(x.value)||0,C=Number(x.book)||0;s+=v,C<0&&l++,x.noOpening&&d++}})});let c=document.getElementById("fnbStockKpiTotalItems"),u=document.getElementById("fnbStockKpiTotalValue"),g=document.getElementById("fnbStockKpiNegative"),b=document.getElementById("fnbStockKpiNoOpening");c&&(c.textContent=r.length.toLocaleString("vi-VN")),u&&(u.textContent=Math.round(s).toLocaleString("vi-VN")+" \u0111"),g&&(g.textContent=l.toLocaleString("vi-VN")),b&&(b.textContent=d.toLocaleString("vi-VN"));let y=document.getElementById("fnbStockTableHead");if(y){let m=`
      <tr>
        <th class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">STT</th>
        <th class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-white/3 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">M\u1EB7t H\xE0ng F&amp;B</th>
        <th class="py-3 px-3 text-center w-16 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">\u0110VT</th>
    `;t.forEach(w=>{let x=w.region==="Mi\u1EC1n Nam";m+=`
        <th class="py-3 px-3 text-right font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 min-w-[125px]">
          <div class="flex items-center justify-end gap-1.5">
            <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${x?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${x?"MN":"MB"}</span>
            <span title="${w.name}" class="text-gray-800 dark:text-gray-200">${w.code}</span>
          </div>
          <div class="text-xs font-normal text-gray-400 truncate max-w-[115px]" title="${w.name}">${w.name}</div>
        </th>
      `}),m+="</tr>",y.innerHTML=m}let p=document.getElementById("fnbStockTableBody");p&&(r.length===0?p.innerHTML=`<tr><td colspan="${t.length+3}" class="text-center py-12 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>`:p.innerHTML=r.map((m,w)=>{let x=o[m.group]||m.group,v=`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${w+1}</td>
            <td class="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-white/3 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${x}</span>
                <span class="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">${m.name}</span>
              </div>
              <div class="text-xs tabular-nums text-gray-400 mt-0.5 flex items-center gap-2">
                <span>${m.code}</span>
                <span>\u2022</span>
                <span>Gi\xE1: ${m.price?Number(m.price).toLocaleString("vi-VN")+" \u0111":"--"}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-medium text-gray-600 dark:text-gray-300 text-xs">${m.unit}</td>
        `;return t.forEach(C=>{let I=m.cells&&m.cells[C.id]||{book:0,lastCount:null,noOpening:!0,value:0},F=Number(I.book)||0,it=F<0?"text-rose-600 dark:text-rose-400 font-semibold":F>0?"text-gray-900 dark:text-white font-bold":"text-gray-400 dark:text-gray-600 font-medium",ft="";if(I.lastCount!==null&&I.lastCount!==void 0&&I.lastCount!==""){let Tt=Number(I.lastCount);if(!isNaN(Tt)){let Ve=Number.isInteger(Tt)?Tt.toLocaleString("vi-VN"):Tt.toFixed(1);ft=` <span class="text-gray-400 dark:text-gray-500 font-normal text-xs" title="\u0110\u1EBFm g\u1EA7n nh\u1EA5t (${I.lastDate||"N/A"}): ${Ve}">(${Ve})</span>`}}let rt="";I.noOpening&&(rt='<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" title="Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u"></span>');let Yt="",je=Number(I.value)||0;$.showValue&&je&&(Yt=`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums mt-0.5">${Math.round(je).toLocaleString("vi-VN")} \u0111</div>`);let Vo=Number.isInteger(F)?F.toLocaleString("vi-VN"):F.toFixed(1);v+=`
            <td class="py-3 px-3 text-right tabular-nums text-xs select-all">
              <div class="flex items-center justify-end">
                ${rt}
                <span class="${it}">${Vo}</span>${ft}
              </div>
              ${Yt}
            </td>
          `}),v+="</tr>",v}).join(""));let h=document.getElementById("fnbStockMobileCards");h&&(r.length===0?h.innerHTML='<div class="text-center py-10 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':h.innerHTML=a.map(m=>{let w=o[m.group]||m.group,x=t.map(v=>{let C=m.cells&&m.cells[v.id]||{book:0,lastCount:null,noOpening:!0,value:0},I=Number(C.book)||0,F=I<0,Et=I===0,it=Number.isInteger(I)?I.toLocaleString("vi-VN"):I.toFixed(1),ft="";if(C.lastCount!==null&&C.lastCount!==void 0&&C.lastCount!==""){let rt=Number(C.lastCount);isNaN(rt)||(ft=`(${Number.isInteger(rt)?rt.toLocaleString("vi-VN"):rt.toFixed(1)})`)}return{site:v,cell:C,isNeg:F,isZero:Et,bookFormatted:it,countText:ft}});return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${w}</span>
                  <span class="text-xs tabular-nums text-gray-400 font-bold">${m.code}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">${m.name}</h4>
              </div>
              <div class="text-right shrink-0">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold tabular-nums">${m.unit}</span>
                <div class="text-xs text-gray-400 tabular-nums mt-1">${m.price?Number(m.price).toLocaleString("vi-VN")+" \u0111":""}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              ${x.map(v=>{let C=v.site.region==="Mi\u1EC1n Nam";return`
                  <div class="p-2.5 rounded-xl ${v.isNeg?"bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40":v.isZero?"bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/60":"bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60"}">
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${v.site.code}</span>
                      <span class="text-[8.5px] px-1 rounded font-semibold ${C?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${C?"MN":"MB"}</span>
                    </div>
                    <div class="flex items-baseline justify-between tabular-nums">
                      <span class="text-xs text-gray-400">T\u1ED3n:</span>
                      <span class="${v.isNeg?"text-rose-600 dark:text-rose-400 font-semibold text-sm":v.isZero?"text-gray-400 font-medium":"text-gray-900 dark:text-white font-bold text-sm"}">${v.bookFormatted} <span class="text-xs text-gray-400 font-normal">${v.countText}</span></span>
                    </div>
                    ${v.cell.noOpening?'<div class="text-xs text-amber-500 font-semibold mt-0.5">\u26A0\uFE0F Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u</div>':""}
                    ${$.showValue&&v.cell.value?`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums text-right mt-0.5">${Math.round(v.cell.value).toLocaleString("vi-VN")} \u0111</div>`:""}
                  </div>
                `}).join("")}
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function On(){let t=document.getElementById("fnbStockFilterRegion"),n=document.getElementById("fnbStockFilterGroup"),o=document.getElementById("fnbStockFilterSite");o&&($.site=o.value),t&&($.region=t.value),n&&($.group=n.value),fe()}function Wn(t){Rt=t,bt()}function Pn(t){$.showValue=t,bt()}function xr(){Dt(V)}var q=window;q.gFnbStockData=V;q.gFnbStockFilter=$;q.gFnbStockSearchTerm=Rt;q.loadFnbStock=fe;q.renderFnbStock=bt;q.onFnbStockFilterChange=On;q.onFnbStockSearch=Wn;q.onFnbStockToggleValue=Pn;q.exportFnbStockExcel=()=>Dt(q.gFnbStockData||V);function he(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function be(t,n){return typeof window.cellBadge=="function"?window.cellBadge(t,n):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${n}</span>`}function ye(t){if(typeof window.escapeHtml=="function")return window.escapeHtml(t);let n=document.createElement("div");return n.textContent=t||"",n.innerHTML}function M(t){return typeof window.fmtVND=="function"?window.fmtVND(t):H(Number(t)||0)}function xe(t){return typeof window.fmtNum=="function"?window.fmtNum(t):L(Number(t)||0)}function K(){let t=window;return t.App||(t.App={}),t.App.items||(t.App.items=[]),t.App.items}function At(t){let n=window;n.App||(n.App={}),n.App.items=t}function yt(){let t=document.getElementById("dinhMucBody"),n=document.getElementById("orderMobileCards"),o=(document.getElementById("orderSearch")?.value||"").toLowerCase(),e=document.getElementById("fLoai")?.value||"",a=document.getElementById("fChiNhap")?.checked,i=document.getElementById("orderSupplyChannel")?.value||"ALL",s=K().filter(d=>{if(o&&!d.maHang.toLowerCase().includes(o)&&!d.tenSP.toLowerCase().includes(o)||e&&d.tenLoai!==e||a&&(!d.soLuongDat||d.soLuongDat<=0))return!1;if(i==="BTT"){let c=((d.nguonCung||"")+" "+(d.tenLoai||"")+" "+(d.tenSP||"")).toLowerCase();if(!c.includes("btt")&&!c.includes("trung t\xE2m")&&!c.includes("ch\u1EBF bi\u1EBFn"))return!1}else if(i==="NCC"){let c=((d.nguonCung||"")+" "+(d.tenLoai||"")).toLowerCase();if(c.includes("btt")||c.includes("trung t\xE2m"))return!1}else if(i==="URGENT"){let c=((d.nganh_hang||"")+" "+(d.tenLoai||"")+" "+(d.tenSP||"")).toLowerCase();if(!c.includes("t\u01B0\u01A1i")&&!c.includes("th\u1ECBt")&&!c.includes("rau")&&!c.includes("kh\u1EA9n"))return!1}return!0});if(!s.length){t&&(t.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</td></tr>'),n&&(n.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</div>');return}let l=window.innerWidth>=1024;t&&(l?t.innerHTML=s.map(d=>{let c=d.soLuongDat||"",u=(d.soLuongDat||0)*(d.donGia||0);return`
          <tr>
            <td class="col-code">${he(d.maHang)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white">${d.tenSP}</span></td>
            <td>${be("neutral",d.tenLoai||"CCDC")}</td>
            <td>${d.dvt||"C\xE1i"}</td>
            <td class="col-num"><span class="num">${M(d.donGia)}</span></td>
            <td class="col-num"><span class="num">${xe(d.daDat)}</span></td>
            <td class="col-num text-right">
              <input type="number" min="0" value="${c}" placeholder="0" class="input h-8 w-24 text-right num"
                oninput="onQtyChange('${d.maHang}', this.value)">
            </td>
            <td class="col-num font-semibold text-brand-600 dark:text-brand-400" id="subtotal-${d.maHang}">${M(u)}</td>
          </tr>
        `}).join(""):t.innerHTML=""),n&&(l?n.innerHTML="":n.innerHTML=s.map(d=>{let c=d.soLuongDat||"",u=(d.soLuongDat||0)*(d.donGia||0);return`
          <div class="data-card space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  ${he(d.maHang)}
                  ${be("neutral",d.tenLoai||"CCDC")}
                  <span class="text-xs text-gray-500">\u0110VT: ${d.dvt||"C\xE1i"}</span>
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${d.tenSP}</h4>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <div>
                <span class="text-xs text-gray-400">\u0110\u01A1n gi\xE1:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${M(d.donGia)}</div>
              </div>
              <div>
                <span class="text-xs text-gray-400">\u0110\xE3 \u0111\u1EB7t l\u0169y k\u1EBF:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${xe(d.daDat)}</div>
              </div>
              <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <div class="flex-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">S\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t:</label>
                  <input type="number" min="0" value="${c}" placeholder="0" class="input h-10 w-full text-center num text-sm font-semibold"
                    oninput="onQtyChange('${d.maHang}', this.value)">
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-400">Th\xE0nh ti\u1EC1n:</span>
                  <div class="text-base font-semibold text-brand-600 dark:text-brand-400 num" id="mob-subtotal-${d.maHang}">${M(u)}</div>
                </div>
              </div>
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function jn(){yt()}function Vn(t,n){let e=K().find(a=>a.maHang===t);if(e){e.soLuongDat=Number(n)||0;let a=document.getElementById(`subtotal-${t}`);a&&(a.textContent=M(e.soLuongDat*(e.donGia||0)));let i=document.getElementById(`mob-subtotal-${t}`);i&&(i.textContent=M(e.soLuongDat*(e.donGia||0))),document.querySelectorAll(`input[oninput*="'${t}'"]`).forEach(r=>{r.value!==n&&(r.value=n)})}xt()}function xt(t,n){let o=document.getElementById("kpiNganSach"),e=document.getElementById("kpiDaDat"),a=t!==void 0?Number(t):Number(o?.dataset?.raw)||Number((o?.textContent||"").replace(/[^\d]/g,""))||0,i=n!==void 0?Number(n):Number(e?.dataset?.raw)||Number((e?.textContent||"").replace(/[^\d]/g,""))||0,s=K().reduce((x,v)=>x+(v.soLuongDat||0)*(v.donGia||0),0),l=i+s,d=a-l,c=a>0?Math.round(l/a*100):0,u=document.getElementById("kpiConLai");u&&(u.dataset.raw=String(d),u.textContent=M(d),u.title=M(d),d<0?(u.classList.remove("text-gray-900","dark:text-white"),u.classList.add("text-rose-600","dark:text-rose-400")):(u.classList.remove("text-rose-600","dark:text-rose-400"),u.classList.add("text-gray-900","dark:text-white")));let g=document.getElementById("kpiDangNhapSub");g&&(g.textContent="\u0110ang nh\u1EADp: "+M(s));let b=document.getElementById("kpiConLaiDelta");b&&(d<0?(b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",b.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>\xC2m h\u1EA1n m\u1EE9c</span>'):(b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",b.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>Kh\u1EA3 d\u1EE5ng</span>'));let y=document.getElementById("kpiTyLe");y&&(y.textContent=c+"%",c>100?y.className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums tracking-tight num":c>80?y.className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums tracking-tight num":y.className="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-white tabular-nums tracking-tight num");let p=document.getElementById("budUsed");p&&(p.textContent=M(l));let h=document.getElementById("budFill"),m=document.getElementById("budBadge"),w=document.getElementById("budNote");h&&(h.style.width=Math.min(c,100)+"%",c>100?(h.className="h-full rounded-full bg-rose-500 transition-all duration-300",m&&(m.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",m.innerHTML=`<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>V\u01B0\u1EE3t ${c-100}%</span>`),w&&(w.innerHTML=`<span class="text-rose-600 dark:text-rose-400 font-semibold">\u26A0\uFE0F V\u01B0\u1EE3t \u0111\u1ECBnh m\u1EE9c ${c-100}%! C\u1EA7n gi\u1EA3i tr\xECnh.</span>`)):c>80?(h.className="h-full rounded-full bg-amber-500 transition-all duration-300",m&&(m.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50",m.innerHTML="<span>G\u1EA7n ch\u1EA1m tr\u1EA7n</span>"),w&&(w.textContent=`\u0110\xE3 d\xF9ng ${c}% ng\xE2n s\xE1ch. G\u1EA7n ch\u1EA1m m\u1EE9c gi\u1EDBi h\u1EA1n.`)):(h.className="h-full rounded-full bg-indigo-500 transition-all duration-300",m&&(m.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",m.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>An to\xE0n</span>'),w&&(w.textContent=`Ng\xE2n s\xE1ch an to\xE0n (${c}%).`)))}async function we(){let t=window,n=localStorage.getItem("orbit_user_site")||t.gCurrentUser&&t.gCurrentUser.assignedSite||"K001",e=((typeof getAppSitesList=="function"?getAppSitesList():[])||t.App&&t.App.siteObjs||[]).find(d=>(d.code||"").toLowerCase()===n.toLowerCase()),a=e?e.ten||e.name:document.getElementById("orderSite")?.value||n,i=document.getElementById("orderSite");if(i&&(i.innerHTML=`<option value="${a}">${a}</option>`,i.value=a),!a)return;let r=document.getElementById("globalMonthPicker")?.value,s=document.getElementById("orderMonth")?.value;if(!s||r&&s!==r){s=r||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;let d=document.getElementById("orderMonth");d&&(d.value=s)}let l="";if(s){let d=s.split("-");l=`${d[1]}/${d[0]}`}typeof showLoading=="function"&&showLoading("T\u1EA3i danh s\xE1ch v\u1EADt t\u01B0 theo Site...");try{let c=await(await fetch(`/api/quota?site=${encodeURIComponent(a)}&thang=${encodeURIComponent(l)}&refresh=true`)).json();if(c.success){At(c.data.items||[]);let u=document.getElementById("kpiNganSach");u&&(u.dataset.raw=String(c.data.nganSach),u.textContent=M(c.data.nganSach),u.title=M(c.data.nganSach));let g=document.getElementById("kpiSubSite");g&&(g.textContent=c.data.site||a,g.title=c.data.site||a);let b=document.getElementById("kpiDaDat");b&&(b.dataset.raw=String(c.data.tienDaDat),b.textContent=M(c.data.tienDaDat),b.title=M(c.data.tienDaDat));let y=document.getElementById("budTotal");y&&(y.textContent=M(c.data.nganSach));let p=K(),h=Array.from(new Set(p.map(w=>w.tenLoai).filter(Boolean))),m=document.getElementById("fLoai");m&&(m.innerHTML='<option value="">T\u1EA5t c\u1EA3 lo\u1EA1i NVL</option>'+h.map(w=>`<option value="${w}">${w}</option>`).join("")),yt(),xt(c.data.nganSach,c.data.tienDaDat),t.lucide&&t.lucide.createIcons&&t.lucide.createIcons()}else typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i \u0111\u1ECBnh m\u1EE9c: "+(c.error||""))}catch(d){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+(d?.message||d))}finally{typeof hideLoading=="function"&&hideLoading()}}function qn(){let n=K().filter(r=>(r.soLuongDat||0)>0);if(!n.length){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng cho \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng.");return}let o=document.getElementById("orderSite")?.value||"",e=document.getElementById("orderMonth")?.value||"",a=n.reduce((r,s)=>r+(s.soLuongDat||0)*(s.donGia||0),0),i=`
    <div class="space-y-3">
      <div class="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
        <div>Site \u0111\u1EB7t: <b>${o}</b></div>
        <div>Th\xE1ng: <b>${e}</b></div>
        <div>T\u1ED5ng ti\u1EC1n \u0111\u01A1n: <b class="text-brand-700 tabular-nums text-sm">${M(a)}</b></div>
      </div>
      <!-- Desktop Table -->
      <div class="hidden sm:block overflow-x-auto max-h-56 rounded-xl border border-gray-200 dark:border-gray-800">
        <table class="data-table">
          <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
          <tbody>
            ${n.map(r=>`
              <tr><td class="p-2 tabular-nums">${r.maHang}</td><td class="p-2">${r.tenSP}</td><td class="p-2 text-right tabular-nums font-bold">${r.soLuongDat}</td><td class="p-2 text-right tabular-nums">${M((r.soLuongDat||0)*r.donGia)}</td></tr>
            `).join("")}
          </tbody>
        </table>
      </div>
      <!-- Mobile Order Items Cards -->
      <div class="block sm:hidden space-y-2 max-h-56 overflow-y-auto">
        ${n.map(r=>`
          <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
            <div class="min-w-0">
              <div class="font-bold text-gray-900 dark:text-white truncate">${ye(r.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${ye(r.maHang)}</div>
            </div>
            <div class="text-right shrink-0">
              <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${r.soLuongDat}</div>
              <div class="num text-[11px] text-gray-500">${M((r.soLuongDat||0)*r.donGia)}</div>
            </div>
          </div>
        `).join("")}
      </div>
      <div>
        <label class="font-bold block mb-1">Ghi ch\xFA / Gi\u1EA3i tr\xECnh:</label>
        <textarea id="orderNote" class="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100" placeholder="Ghi ch\xFA \u0111\u01A1n h\xE0ng..."></textarea>
      </div>
      <div class="flex justify-end gap-2 pt-2">
        <button onclick="closeGeneralModal()" class="px-3 py-1.5 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-300 font-bold">Xem l\u1EA1i</button>
        <button onclick="submitOrder()" class="px-4 py-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg shadow-sm">G\u1EEDi \u0111\u01A1n \u0111\u1EB7t h\xE0ng</button>
      </div>
    </div>
  `;typeof openGeneralModal=="function"&&openGeneralModal("X\xE1c nh\u1EADn \u0111\u1EB7t h\xE0ng v\u1EADt t\u01B0",i)}async function Un(){let t=window,n=K(),o=n.filter(s=>(s.soLuongDat||0)>0),e=document.getElementById("orderSite")?.value||"",a=document.getElementById("orderMonth")?.value||"",i=document.getElementById("orderNote"),r=i?i.value:"";typeof showLoading=="function"&&showLoading("L\u01B0u \u0111\u01A1n h\xE0ng v\xE0o Cloudflare D1...");try{let s={site:e,thang:a,nguoiDat:t.App&&t.App.user?t.App.user.email:"B\u1EBFp tr\u01B0\u1EDFng Site",ghiChu:r,items:o.map(c=>({maHang:c.maHang,tenSP:c.tenSP,dvt:c.dvt,donGia:c.donGia,soLuong:c.soLuongDat||0,daDat:c.daDat}))},d=await(await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();d.success?(typeof closeGeneralModal=="function"&&closeGeneralModal(),typeof showToast=="function"&&showToast(`\u0110\xE3 t\u1EA1o \u0111\u01A1n h\xE0ng th\xE0nh c\xF4ng! M\xE3: ${d.data.maDon}`),n.forEach(c=>{c.soLuongDat=0}),we()):typeof showToast=="function"&&showToast("L\u1ED7i: "+d.error)}catch(s){typeof showToast=="function"&&showToast("L\u1ED7i: "+(s?.message||s))}finally{typeof hideLoading=="function"&&hideLoading()}}var G=window;G.loadQuota=we;G.renderOrderTable=yt;G.filterItems=jn;G.onQtyChange=Vn;G.calcBudget=xt;G.reviewOrder=qn;G.submitOrder=Un;G.getAppOrderItems=K;G.setAppOrderItems=At;function ve(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function Xn(t){return typeof window.cellDate=="function"?window.cellDate(t):`<span class="tabular-nums text-xs text-gray-500">${Q(t)}</span>`}function ke(t){return typeof window.cellPerson=="function"?window.cellPerson(t):`<span class="text-xs font-medium text-gray-700 dark:text-gray-300">${E(t||"\u2014")}</span>`}function Le(t,n){return typeof window.cellBadge=="function"?window.cellBadge(t,n):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${n}</span>`}function E(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function D(t){return typeof window.fmtVND=="function"?window.fmtVND(t):H(Number(t)||0)}function pt(t){return typeof window.fmtNum=="function"?window.fmtNum(t):L(Number(t)||0)}function Q(t){return t?typeof window.fmtDate=="function"?window.fmtDate(t):U(t):"\u2014"}function z(t){let n=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let e=o.permissions["portal-history"],a=o.permissions["portal-order"];if(e&&e.canEdit!==void 0)return!!e.canEdit;if(a&&a.canEdit!==void 0)return!!a.canEdit}if(o.role==="BEP_TRUONG"){if(!t)return!0;let e=(t.trangThai||t.status||"").toUpperCase();return e.includes("M\u1EDAI")||e.includes("CH\u1EDC")||e.includes("PENDING")||e===""}return!1}function J(t){let n=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let e=o.permissions["portal-history"],a=o.permissions["portal-order"];if(e&&e.canDelete!==void 0)return!!e.canDelete;if(a&&a.canDelete!==void 0)return!!a.canDelete}if(o.role==="BEP_TRUONG"){if(!t)return!0;let e=(t.trangThai||t.status||"").toUpperCase();return e.includes("M\u1EDAI")||e.includes("CH\u1EDC")||e.includes("PENDING")||e===""}return!1}function Ot(t){let n=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let e=o.permissions["portal-history"],a=o.permissions["portal-order"];if(e&&(e.canAuthenticate!==void 0||e.canVerify!==void 0||e.canEdit!==void 0))return!!(e.canAuthenticate||e.canVerify||e.canEdit);if(a&&(a.canAuthenticate!==void 0||a.canVerify!==void 0||a.canEdit!==void 0))return!!(a.canAuthenticate||a.canVerify||a.canEdit)}return!1}function Wt(t,n,o){let e=Number(t)||1,i=n||{1:"Site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn",3:"Chuy\u1EC3n Tr\u01B0\u1EDFng Kho",4:"Mail cho PMH",5:"PMH \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"\u0110\xE3 giao v\u1EC1 site"}[e]||`B\u01B0\u1EDBc ${e}`,r="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",s="bg-blue-500";return e>=7?(r="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",s="bg-emerald-500"):e>=4?(r="bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",s="bg-indigo-500"):e>=2&&(r="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",s="bg-amber-500"),`
    <button type="button" onclick="openOrderJourneyModal('${o}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${r} hover:shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer" title="B\u1EA5m \u0111\u1EC3 xem v\xE0 x\xE1c th\u1EF1c h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng">
      <span class="w-1.5 h-1.5 rounded-full ${s} animate-pulse shrink-0"></span>
      <span class="font-mono text-[11px] font-bold shrink-0">B${e}/7:</span>
      <span class="truncate max-w-[100px] text-left">${E(i)}</span>
    </button>
  `}function Pt(t){let n=document.getElementById("hsBody"),o=document.getElementById("hsMobileCards");if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}n&&(n.innerHTML=t.map(e=>{let a=z(e),i=J(e);return`
        <tr>
          <td class="col-code min-w-[130px]">${ve(e.maDon)}</td>
          <td class="col-date min-w-[110px]">${Xn(e.ngayDat)}</td>
          <td class="min-w-[260px] max-w-[360px]">
            <div class="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-normal leading-snug break-words">
              ${E(e.site||"\u2014")}
            </div>
          </td>
          <td class="min-w-[130px]">${ke(e.nguoiDat)}</td>
          <td class="col-num">${e.soDong}</td>
          <td class="col-num font-medium">${pt(e.tongSL)}</td>
          <td class="col-num font-semibold text-brand-600 dark:text-brand-400">${D(e.tongTien)}</td>
          <td class="col-badge min-w-[140px] text-center">${Le("neutral",e.trangThai||"M\u1EDBi t\u1EA1o")}</td>
          <td class="text-center min-w-[170px]">
            ${Wt(e.currentStep,e.currentStepName,e.maDon)}
          </td>
          <td class="col-actions min-w-[220px]">
            <div class="flex items-center justify-end gap-1.5">
              <button onclick="viewOrderDetail('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs hover:border-slate-400 dark:hover:border-gray-600 transition" title="Xem chi ti\u1EBFt \u0111\u01A1n h\xE0ng">
                <svg class="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
                <span>Xem</span>
              </button>
              <button onclick="openOrderJourneyModal('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition" title="Theo d\xF5i & X\xE1c th\u1EF1c h\xE0nh tr\xECnh">
                <svg class="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                <span>H\xE0nh tr\xECnh</span>
              </button>
              ${a?`
                <button onclick="openEditOrderModal('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition" title="Ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>S\u1EEDa</span>
                </button>
              `:""}
              ${i?`
                <button onclick="confirmDeleteOrder('${e.maDon}')" class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition" title="X\xF3a \u0111\u01A1n h\xE0ng">
                  <svg class="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a</span>
                </button>
              `:""}
            </div>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(e=>{let a=z(e),i=J(e);return`
        <div class="data-card space-y-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            ${ve(e.maDon)}
            ${Le("neutral",e.trangThai||"M\u1EDBi t\u1EA1o")}
          </div>
          <div class="font-bold text-sm text-gray-900 dark:text-white leading-snug break-words">
            ${E(e.site||"\u2014")}
          </div>
          <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Ti\u1EBFn \u0111\u1ED9:</span>
            </div>
            ${Wt(e.currentStep,e.currentStepName,e.maDon)}
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="num text-gray-900 dark:text-white whitespace-nowrap">${Q(e.ngayDat)}</b></div>
            <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b>${ke(e.nguoiDat)}</b></div>
            <div>S\u1ED1 m\u1EB7t h\xE0ng: <b class="num text-gray-900 dark:text-white">${e.soDong} d\xF2ng</b></div>
            <div>T\u1ED5ng SL: <b class="num text-gray-900 dark:text-white">${pt(e.tongSL)}</b></div>
            <div class="col-span-2 flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <span class="text-gray-500 font-medium">T\u1ED5ng gi\xE1 tr\u1ECB \u0111\u01A1n:</span>
              <span class="num font-semibold text-sm text-brand-600 dark:text-brand-400">${D(e.tongTien)}</span>
            </div>
          </div>
          <div class="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="viewOrderDetail('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-gray-800 hover:bg-slate-50 dark:hover:bg-gray-700 border border-slate-300 dark:border-gray-700 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
              <span>Chi ti\u1EBFt</span>
            </button>
            <button onclick="openOrderJourneyModal('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs">
              <svg class="w-3.5 h-3.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>H\xE0nh tr\xECnh</span>
            </button>
            ${a?`
              <button onclick="openEditOrderModal('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                <span>S\u1EEDa</span>
              </button>
            `:""}
            ${i?`
              <button onclick="confirmDeleteOrder('${e.maDon}')" class="inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs">
                <svg class="w-3.5 h-3.5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                <span>X\xF3a</span>
              </button>
            `:""}
          </div>
        </div>
      `}).join(""))}function Se(t){let n=window,o=n.App&&n.App.historyOrders?n.App.historyOrders:[];if(!t||t==="ALL"){Pt(o);return}let e=o.filter(a=>{let i=(a.trangThai||"").toUpperCase();return t==="APPROVED"?i.includes("DUY\u1EC6T")||i.includes("APPROVED"):t==="PENDING"?i.includes("CH\u1EDC")||i.includes("T\u1EA0O")||i.includes("PENDING"):t==="DELIVERED"?i.includes("NH\u1EACN")||i.includes("GIAO")||i.includes("DELIVERED"):t==="REJECTED"?i.includes("H\u1EE6Y")||i.includes("T\u1EEA CH\u1ED0I")||i.includes("REJECT"):!0});Pt(e)}async function Kn(){let t=window,n=document.getElementById("globalBranchSelect")?.value,o=t.gCurrentUser||(typeof t.loadPersistedUser=="function"?t.loadPersistedUser():null),e=o?o.assignedSite:"",a=localStorage.getItem("orbit_user_site"),i=document.getElementById("hsSite")?.value,r="";n?r=n==="ALL"?"":n:e?r=e==="ALL"?"":e:a?r=a==="ALL"?"":a:i&&(r=i==="ALL"?"":i);let s=document.getElementById("hsCurrentSiteBadge");if(s){if(r&&r!=="ALL"){let g=((typeof t.getAppSitesList=="function"?t.getAppSitesList():[])||[]).find(b=>b.code.toUpperCase()===r.toUpperCase()||b.name===r||b.ten&&b.ten===r);s.textContent=g?g.ten||g.name:r}else s.textContent="T\u1EA5t c\u1EA3 \u0111i\u1EC3m b\xE1n";s.classList.remove("hidden")}let l=document.getElementById("hsSite");l&&(l.value=r);let d=document.getElementById("hsMonth")?.value||"",c="";if(d){let u=d.split("-");c=`${u[1]}/${u[0]}`}try{typeof showLoading=="function"&&showLoading("T\u1EA3i l\u1ECBch s\u1EED \u0111\u01A1n h\xE0ng...");let u=`/api/orders?site=${encodeURIComponent(r)}&thang=${encodeURIComponent(c)}&_t=${Date.now()}`,b=await(await fetch(u,{cache:"no-store",headers:{"Cache-Control":"no-cache",Pragma:"no-cache"}})).json();t.App||(t.App={}),t.App.historyOrders=b.success&&b.data?b.data:[];let y=document.getElementById("hsOrderStatusFilter")?.value||"ALL";Se(y)}catch(u){console.error("loadHistory error:",u)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}async function Gn(t){typeof showLoading=="function"&&showLoading("T\u1EA3i chi ti\u1EBFt \u0111\u01A1n...");try{let o=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}`)).json();if(o.success){let{info:e,items:a,timeline:i}=o.data,r=`
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800">
            <div>
              <div class="tabular-nums font-bold">${e.order_code}</div>
              <div class="text-gray-500 dark:text-gray-400">${e.site_name} \xB7 ${e.ordered_by}</div>
            </div>
            <button onclick="if(typeof exportSingleOrderExcel==='function')exportSingleOrderExcel('${e.order_code}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1">
              Xu\u1EA5t Excel
            </button>
          </div>
          <!-- Desktop Table -->
          <div class="hidden sm:block overflow-x-auto max-h-48 rounded-xl border border-gray-200 dark:border-gray-800">
            <table class="data-table">
              <thead class="bg-gray-50 dark:bg-gray-900/50"><tr><th class="p-2">M\xE3</th><th class="p-2">T\xEAn</th><th class="p-2">\u0110VT</th><th class="p-2 text-right">SL</th><th class="p-2 text-right">\u0110\u01A1n gi\xE1</th><th class="p-2 text-right">Th\xE0nh ti\u1EC1n</th></tr></thead>
              <tbody>
                ${(a||[]).map(s=>`<tr><td class="p-2 tabular-nums">${s.maHang}</td><td class="p-2">${s.tenSP}</td><td class="p-2">${s.dvt}</td><td class="p-2 text-right tabular-nums font-bold">${s.soLuong}</td><td class="p-2 text-right tabular-nums">${D(s.donGia)}</td><td class="p-2 text-right tabular-nums font-bold">${D(s.thanhTien)}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>

          <!-- Native Mobile Cards for Order Details -->
          <div class="block sm:hidden space-y-2 max-h-48 overflow-y-auto">
            ${(a||[]).map(s=>`
              <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
                <div class="min-w-0">
                  <div class="font-bold text-gray-900 dark:text-white truncate">${E(s.tenSP)}</div>
                  <div class="font-mono text-[11px] text-gray-400">${E(s.maHang)} \xB7 <span class="font-sans">${E(s.dvt||"")}</span></div>
                </div>
                <div class="text-right shrink-0">
                  <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${s.soLuong}</div>
                  <div class="num text-[11px] text-gray-500">${D(s.thanhTien)}</div>
                </div>
              </div>
            `).join("")}
          </div>
          <div class="pt-2">
            <div class="flex items-center justify-between mb-2">
              <b class="text-gray-900 dark:text-white flex items-center gap-1.5">
                <svg class="w-4 h-4 text-brand-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
                H\xE0nh tr\xECnh x\u1EED l\xFD \u0111\u01A1n h\xE0ng:
              </b>
              <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${e.order_code}')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
                <span>Xem & X\xE1c th\u1EF1c chi ti\u1EBFt</span>
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
              </button>
            </div>
            <div class="space-y-2 border-l-2 border-indigo-200 dark:border-indigo-800/80 pl-3">
              ${(i||[]).map(s=>`
                <div class="p-2 rounded-lg bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-xs">
                  <div class="flex justify-between font-bold text-gray-800 dark:text-gray-100">
                    <span>B\u01B0\u1EDBc ${s.buoc}: ${s.tenBuoc}</span>
                    <span class="tabular-nums text-gray-400 dark:text-gray-500 font-normal">${s.thoiGian?Q(s.thoiGian):""}</span>
                  </div>
                  <div class="text-gray-500 dark:text-gray-400 mt-0.5">${s.nguoiXuLy||"H\u1EC7 th\u1ED1ng"} \xB7 Tr\u1EA1ng th\xE1i: <span class="font-bold text-brand-700 dark:text-brand-400">${s.trangThai}</span>${s.ghiChu?` \xB7 <span class="italic text-gray-600 dark:text-gray-300">"${E(s.ghiChu)}"</span>`:""}</div>
                </div>
              `).join("")}
            </div>
          </div>
          <div class="flex items-center justify-between gap-2 pt-3 border-t border-gray-200 dark:border-gray-800">
            <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openOrderJourneyModal('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/60 shadow-2xs transition">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"/></svg>
              <span>H\xE0nh tr\xECnh \u0111\u01A1n</span>
            </button>
            <div class="flex items-center gap-2">
              ${z(e)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openEditOrderModal('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>Ch\u1EC9nh s\u1EEDa \u0111\u01A1n</span>
                </button>
              `:""}
              ${J(e)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); confirmDeleteOrder('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a \u0111\u01A1n h\xE0ng</span>
                </button>
              `:""}
            </div>
          </div>
        </div>
      `;typeof openGeneralModal=="function"&&openGeneralModal(`\u0110\u01A1n h\xE0ng ${t}`,r)}}catch(n){typeof showToast=="function"&&showToast("L\u1ED7i: "+(n?.message||n))}finally{typeof hideLoading=="function"&&hideLoading()}}var Qn=null,zn=null,jt=[{step:1,name:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",desc:"\u0110i\u1EC3m b\xE1n t\u1EA1o phi\u1EBFu \u0111\u1EB7t h\xE0ng th\xE0nh c\xF4ng qua h\u1EC7 th\u1ED1ng Portal"},{step:2,name:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",desc:"Admin/B\u1ED9 ph\u1EADn \u0111i\u1EC1u ph\u1ED1i ki\u1EC3m tra \u0111\u1ECBnh m\u1EE9c & duy\u1EC7t ti\u1EBFp nh\u1EADn \u0111\u01A1n"},{step:3,name:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",desc:"Th\u1EE7 kho ti\u1EBFp nh\u1EADn y\xEAu c\u1EA7u, ph\xE2n lo\u1EA1i v\xE0 chu\u1EA9n b\u1ECB k\u1EBF ho\u1EA1ch so\u1EA1n"},{step:4,name:"Kho mail cho PMH",desc:"Kho ph\u1ED1i h\u1EE3p ph\xF2ng mua h\xE0ng ho\u1EB7c nh\xE0 cung c\u1EA5p ki\u1EC3m tra t\u1ED3n kho"},{step:5,name:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",desc:"Ph\xF2ng mua h\xE0ng x\xE1c nh\u1EADn \u0111\u01A1n h\xE0ng v\u1EDBi NCC ho\u1EB7c xu\u1EA5t kho t\u1ED5ng"},{step:6,name:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",desc:"H\xE0ng h\xF3a t\u1EADp k\u1EBFt, ki\u1EC3m \u0111\u1EBFm ch\u1EA5t l\u01B0\u1EE3ng v\xE0 \u0111\xF3ng g\xF3i chuy\u1EC3n \u0111i"},{step:7,name:"Kho giao v\u1EC1 c\xE1c site",desc:"\u0110ang v\u1EADn chuy\u1EC3n giao v\u1EC1 \u0111i\u1EC3m b\xE1n / B\u1EBFp tr\u01B0\u1EDFng k\xFD nh\u1EADn \u0111\u1EE7"}];function Vt(t,n){let o=document.getElementById("journeyTimelineContainer");if(!o)return;let e=document.getElementById("journeyCurrentStepText"),a={};(n||[]).forEach(s=>{let l=Number(s.buoc);l&&(a[l]=s)});let i=Object.keys(a).map(Number),r=i.length?Math.max(...i):1;e&&(e.textContent=`B\u01B0\u1EDBc ${r}/7 (${jt[r-1]?.name||""})`),o.innerHTML=jt.map(s=>{let l=a[s.step],d=l&&(l.trangThai==="Ho\xE0n th\xE0nh"||l.trangThai==="Ho\xE0n t\u1EA5t"),c=s.step===r||l&&!d,u="bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700",g=`<span class="font-mono text-xs font-bold">${s.step}</span>`,b="border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/60",y="text-gray-500 dark:text-gray-400 font-medium",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Ch\u1EDD x\u1EED l\xFD</span>';return d?(u="bg-emerald-600 text-white border-emerald-600 shadow-sm",g='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>',b="border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20",y="text-emerald-900 dark:text-emerald-200 font-bold",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>\u0110\xE3 ho\xE0n th\xE0nh</span>'):c&&(u="bg-indigo-600 text-white border-indigo-600 shadow-sm ring-4 ring-indigo-100 dark:ring-indigo-950/60",g='<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg>',b="border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-200 dark:ring-indigo-800/50",y="text-indigo-900 dark:text-indigo-100 font-bold",p='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>\u0110ang x\u1EED l\xFD</span>'),`
      <div class="relative flex items-start gap-3 group">
        <div class="absolute -left-[27px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${u}">
          ${g}
        </div>
        <div class="flex-1 p-3 rounded-xl border ${b} shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs ${y}">B\u01B0\u1EDBc ${s.step}: ${E(l?.tenBuoc||s.name)}</span>
            ${p}
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">${E(s.desc)}</p>
          ${l?`
            <div class="pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div class="text-gray-600 dark:text-gray-300">
                Ng\u01B0\u1EDDi x\u1EED l\xFD: <b class="text-gray-900 dark:text-white">${E(l.nguoiXuLy||"H\u1EC7 th\u1ED1ng")}</b>
              </div>
              <div class="text-gray-400 dark:text-gray-500 font-mono">
                ${l.thoiGian?Q(l.thoiGian):""}
              </div>
              ${l.ghiChu?`
                <div class="w-full text-gray-700 dark:text-gray-300 italic bg-white/70 dark:bg-gray-800/60 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                  " ${E(l.ghiChu)} "
                </div>
              `:""}
            </div>
          `:""}
        </div>
      </div>
    `}).join("")}async function Jn(t){if(!t)return;Qn=t,window._currentJourneyOrderCode=t;let n=document.getElementById("modalOrderJourney");if(!n)return;let o=document.getElementById("journeyOrderSubtitle");o&&(o.textContent=`M\xE3 \u0111\u01A1n: ${t}`),typeof showLoading=="function"&&showLoading("T\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng...");try{let a=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!a.success||!a.data){typeof showToast=="function"&&showToast(a.error||"Kh\xF4ng th\u1EC3 t\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng","error");return}let{info:i,timeline:r}=a.data;zn=a.data,window._currentJourneyData=a.data;let s=document.getElementById("journeySiteName");s&&(s.textContent=i.site_name||i.site||"\u2014");let l=document.getElementById("journeyOrderedBy");l&&(l.textContent=i.ordered_by||"\u2014");let d=document.getElementById("journeyOrderDate");d&&(d.textContent=Q(i.order_date||""));let c=document.getElementById("journeyBadgeStatus");c&&(c.textContent=i.status||"\u0110ang x\u1EED l\xFD"),Vt(i,r||[]);let u=Ot(i),g=document.getElementById("journeyAdminSection");if(g)if(u){g.classList.remove("hidden");let b=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,y=document.getElementById("journeyAdminActor");y&&(y.textContent=b&&(b.fullName||b.email)||"Qu\u1EA3n tr\u1ECB vi\xEAn");let p=r&&r.length?Math.max(...r.map(x=>Number(x.buoc)||1)):1,h=Math.min(p+1,7),m=document.getElementById("journeySelectStep");m&&(m.value=String(h));let w=document.getElementById("journeyStepNote");w&&(w.value="")}else g.classList.add("hidden");n.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(e){console.error("Error openOrderJourneyModal:",e),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi t\u1EA3i h\xE0nh tr\xECnh","error")}finally{typeof hideLoading=="function"&&hideLoading()}}function Yn(){let t=document.getElementById("modalOrderJourney");t&&t.classList.add("hidden")}async function Zn(){let t=Qn||window._currentJourneyOrderCode;if(!t)return;let n=document.getElementById("journeySelectStep"),o=document.getElementById("journeyStepStatus"),e=document.getElementById("journeyStepNote"),a=document.getElementById("btnSubmitJourneyStep"),i=Number(n?n.value:1),r=o?o.value:"Ho\xE0n th\xE0nh",s=e?e.value.trim():"",l=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,d=l&&(l.fullName||l.email)||"Admin",u={1:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",3:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",4:"Kho mail cho PMH",5:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"Kho giao v\u1EC1 c\xE1c site"}[i]||`B\u01B0\u1EDBc ${i}`;try{a&&(a.disabled=!0,a.innerHTML='<span class="inline-block animate-spin mr-1">\u23F3</span> \u0110ang l\u01B0u...');let b=await(await fetch("/api/order-journey",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,step:i,stepName:u,status:r,note:s,actor:d})})).json();if(!b.success){typeof showToast=="function"&&showToast(b.error||"C\u1EADp nh\u1EADt b\u01B0\u1EDBc h\xE0nh tr\xECnh th\u1EA5t b\u1EA1i","error");return}if(typeof showToast=="function"&&showToast(`\u0110\xE3 x\xE1c th\u1EF1c th\xE0nh c\xF4ng B\u01B0\u1EDBc ${i}: ${u}`,"success"),b.data&&b.data.timeline){let y=zn?.info||window._currentJourneyData?.info||{order_code:t};y.status=b.data.orderStatus;let p=document.getElementById("journeyBadgeStatus");p&&(p.textContent=y.status),Vt(y,b.data.timeline),n&&i<7&&(n.value=String(i+1)),e&&(e.value="")}typeof window.loadHistory=="function"&&window.loadHistory()}catch(g){console.error("Error submitJourneyStep:",g),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi c\u1EADp nh\u1EADt ti\u1EBFn \u0111\u1ED9","error")}finally{a&&(a.disabled=!1,a.innerHTML='<i data-lucide="check" class="w-3.5 h-3.5"></i><span>X\xE1c nh\u1EADn c\u1EADp nh\u1EADt b\u01B0\u1EDBc n\xE0y</span>',typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons())}}var B=[],Ce=null;async function to(t){if(!z()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}typeof showLoading=="function"&&showLoading("\u0110ang t\u1EA3i th\xF4ng tin \u0111\u01A1n h\xE0ng...");try{let o=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n h\xE0ng");let{info:e,items:a}=o.data,i=document.getElementById("editOrderCode");i&&(i.value=e.order_code||t);let r=document.getElementById("editOrderSubtitle");r&&(r.textContent=`M\xE3 \u0111\u01A1n: ${e.order_code||t}`);let s=document.getElementById("editOrderSite");if(s){let p=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[])||[];s.innerHTML=p.map(h=>{let m=h.ten||h.name||h.code||h,w=e.site_name===m||e.site_name===h.name||e.site_name===h.code?"selected":"";return`<option value="${m}" ${w}>${m}</option>`}).join(""),e.site_name&&!p.some(h=>(h.ten||h.name||h.code)===e.site_name)&&s.insertAdjacentHTML("afterbegin",`<option value="${e.site_name}" selected>${e.site_name}</option>`)}let l=document.getElementById("editOrderDate");l&&(l.value=(e.order_date||"").slice(0,10));let d=document.getElementById("editOrderStatus");d&&(d.value=e.status||"M\u1EDBi t\u1EA1o");let c=document.getElementById("editOrderNguoiDat");c&&(c.value=e.ordered_by||"");let u=document.getElementById("editOrderThang");u&&(u.value=e.applied_month||"");let g=document.getElementById("editOrderGhiChu");g&&(g.value=""),B=(a||[]).map(p=>({maHang:p.maHang||p.item_code,tenSP:p.tenSP||p.item_name,dvt:p.dvt||p.unit||"Ph\u1EA7n",soLuong:Number(p.soLuong??p.order_qty??1),donGia:Number(p.donGia??p.unit_price??0),thanhTien:Number(p.thanhTien??(p.soLuong||1)*(p.donGia||0)),ghiChu:p.ghiChu||""})),window._editOrderItems=B;let b=document.getElementById("editOrderAddSelect");if(b){let p=window,h=p.App&&p.App.items&&p.App.items.length?p.App.items:[];if(!h.length)try{let w=await(await fetch(`/api/quota?site=${encodeURIComponent(e.site_name||"K001")}&thang=${encodeURIComponent(e.applied_month||"")}`)).json();w.success&&w.data?.items&&(h=w.data.items,p.App&&(p.App.items=h))}catch{}b.innerHTML='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng mu\u1ED1n th\xEAm --</option>'+h.map(m=>`
          <option value="${E(m.maHang||m.code)}" 
                  data-name="${E(m.tenHang||m.tenSP||m.name||"")}" 
                  data-unit="${E(m.dvt||m.unit||"Ph\u1EA7n")}" 
                  data-price="${Number(m.donGia||m.price||0)}">
            [${E(m.maHang||m.code)}] ${E(m.tenHang||m.tenSP||m.name||"")} (${D(m.donGia||m.price||0)}/${m.dvt||m.unit||""})
          </option>
        `).join("")}gt();let y=document.getElementById("modalEditOrder");y&&y.classList.remove("hidden")}catch(n){console.error("openEditOrderModal error:",n),typeof showToast=="function"&&showToast("L\u1ED7i: "+(n?.message||n),"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}function Ee(){let t=document.getElementById("modalEditOrder");t&&t.classList.add("hidden"),B=[],window._editOrderItems=[]}function gt(){let t=document.getElementById("editOrderItemsBody"),n=document.getElementById("editOrderItemsMobile"),o=B;t&&(o.length?t.innerHTML=o.map((e,a)=>`
        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
          <td class="p-2.5 text-center text-gray-400 font-mono">${a+1}</td>
          <td class="p-2.5 font-mono font-medium text-gray-900 dark:text-white">${E(e.maHang)}</td>
          <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">${E(e.tenSP)}</td>
          <td class="p-2.5 text-center text-gray-500">${E(e.dvt)}</td>
          <td class="p-2.5 text-right">
            <input type="number" min="0.1" step="0.5" value="${e.soLuong}" 
                   onchange="updateEditOrderItemQty(${a}, this.value)" 
                   class="w-20 px-2 py-1 text-right font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-500">
          </td>
          <td class="p-2.5 text-right font-mono text-gray-500">${D(e.donGia)}</td>
          <td class="p-2.5 text-right font-mono font-bold text-brand-600 dark:text-brand-400">${D(e.soLuong*e.donGia)}</td>
          <td class="p-2.5 text-center">
            <button type="button" onclick="removeEditOrderItemLine(${a})" class="p-1 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors" title="X\xF3a d\xF2ng">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </td>
        </tr>
      `).join(""):t.innerHTML='<tr><td colspan="8" class="p-4 text-center text-gray-400">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o. Vui l\xF2ng th\xEAm m\u1EB7t h\xE0ng b\xEAn d\u01B0\u1EDBi.</td></tr>'),n&&(o.length?n.innerHTML=o.map((e,a)=>`
        <div class="p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/40 space-y-2">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="font-bold text-gray-900 dark:text-white">${E(e.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${E(e.maHang)} \xB7 <span class="font-sans">${E(e.dvt)}</span></div>
            </div>
            <button type="button" onclick="removeEditOrderItemLine(${a})" class="p-1 text-rose-500 hover:text-rose-700">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path></svg>
            </button>
          </div>
          <div class="flex items-center justify-between text-xs pt-1 border-t border-gray-200 dark:border-gray-700/60">
            <div class="flex items-center gap-1.5">
              <span class="text-gray-500">S\u1ED1 l\u01B0\u1EE3ng:</span>
              <input type="number" min="0.1" step="0.5" value="${e.soLuong}" 
                     onchange="updateEditOrderItemQty(${a}, this.value)" 
                     class="w-16 px-1.5 py-0.5 text-center font-mono font-bold bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">
            </div>
            <div class="text-right">
              <div class="font-mono font-bold text-brand-600 dark:text-brand-400">${D(e.soLuong*e.donGia)}</div>
            </div>
          </div>
        </div>
      `).join(""):n.innerHTML='<div class="p-4 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o</div>'),Te()}function eo(t,n){let o=Math.max(0,Number(n)||0);B&&B[t]&&(B[t].soLuong=o,B[t].thanhTien=o*(B[t].donGia||0),gt())}function no(t){B&&B.length>t&&(B.splice(t,1),gt())}function oo(){let t=document.getElementById("editOrderAddSelect"),n=document.getElementById("editOrderAddQty");if(!t||!t.value){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t m\u1EB7t h\xE0ng \u0111\u1EC3 th\xEAm","warning");return}let o=t.value,e=t.selectedOptions[0],a=e.getAttribute("data-name")||o,i=e.getAttribute("data-unit")||"Ph\u1EA7n",r=Number(e.getAttribute("data-price"))||0,s=Math.max(.1,Number(n?n.value:1)||1),l=B.find(d=>d.maHang===o);l?(l.soLuong+=s,l.thanhTien=l.soLuong*l.donGia):B.push({maHang:o,tenSP:a,dvt:i,soLuong:s,donGia:r,thanhTien:s*r,ghiChu:""}),t.value="",n&&(n.value="1"),gt()}function Te(){let t=B,n=0,o=0;t.forEach(r=>{n+=Number(r.soLuong)||0,o+=(Number(r.soLuong)||0)*(Number(r.donGia)||0)});let e=document.getElementById("editOrderItemsCount");e&&(e.textContent=String(t.length));let a=document.getElementById("editOrderTotalQty");a&&(a.textContent=pt(n));let i=document.getElementById("editOrderTotalAmount");i&&(i.textContent=D(o))}async function ao(){if(!z()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}let t=document.getElementById("editOrderCode")?.value;if(!t){typeof showToast=="function"&&showToast("Thi\u1EBFu m\xE3 \u0111\u01A1n h\xE0ng","error");return}let n=document.getElementById("editOrderSite")?.value,o=document.getElementById("editOrderDate")?.value,e=document.getElementById("editOrderStatus")?.value,a=document.getElementById("editOrderNguoiDat")?.value,i=document.getElementById("editOrderThang")?.value,r=document.getElementById("editOrderGhiChu")?.value,s=B.filter(d=>(Number(d.soLuong)||0)>0);if(!s.length){typeof showToast=="function"&&showToast("\u0110\u01A1n h\xE0ng ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng c\xF3 s\u1ED1 l\u01B0\u1EE3ng > 0","warning");return}let l=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser;typeof showLoading=="function"&&showLoading("\u0110ang l\u01B0u c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng...");try{let c=await(await fetch("/api/order",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,site:n,orderDate:o,status:e,orderedBy:a,month:i,ghiChu:r,actor:l?l.full_name||l.fullName||l.email:"Ng\u01B0\u1EDDi qu\u1EA3n tr\u1ECB",items:s})})).json();if(!c.success)throw new Error(c.error||"C\u1EADp nh\u1EADt th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),Ee(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(d){console.error("saveEditOrder error:",d),typeof showToast=="function"&&showToast("L\u1ED7i l\u01B0u \u0111\u01A1n h\xE0ng: "+(d?.message||d),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}async function ro(t){if(!J()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning");return}Ce=t,window._pendingDeleteOrderCode=t;let n=document.getElementById("confirmDeleteOrderCode");n&&(n.textContent=t);let o=document.getElementById("confirmDeleteOrderInfo");o&&(o.innerHTML='<span class="text-gray-400">\u0110ang t\u1EA3i chi ti\u1EBFt \u0111\u01A1n...</span>');let e=document.getElementById("modalConfirmDeleteOrder");e&&e.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();try{let i=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(i.success&&i.data&&o){let{info:r,items:s}=i.data,l=(s||[]).reduce((c,u)=>c+(Number(u.thanhTien)||0),0),d=(s||[]).reduce((c,u)=>c+(Number(u.soLuong)||0),0);o.innerHTML=`
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div>\u0110i\u1EC3m b\xE1n: <b class="text-gray-900 dark:text-white truncate block">${E(r.site_name||"\u2014")}</b></div>
          <div>Ng\xE0y \u0111\u1EB7t: <b class="num font-medium text-gray-900 dark:text-white">${Q(r.order_date)}</b></div>
          <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b class="text-gray-900 dark:text-white truncate block">${E(r.ordered_by||"\u2014")}</b></div>
          <div>Tr\u1EA1ng th\xE1i: <b class="text-brand-600 dark:text-brand-400">${E(r.status||"M\u1EDBi t\u1EA1o")}</b></div>
          <div class="col-span-2 pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span>M\u1EB7t h\xE0ng: <b>${s.length} m\xF3n (${pt(d)} SL)</b></span>
            <span class="font-bold text-sm text-brand-600 dark:text-brand-400">${D(l)}</span>
          </div>
        </div>
      `}}catch{}}function qt(){let t=document.getElementById("modalConfirmDeleteOrder");t&&t.classList.add("hidden"),Ce=null,window._pendingDeleteOrderCode=null}async function so(){let t=Ce||window._pendingDeleteOrderCode;if(t){if(!J()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning"),qt();return}typeof showLoading=="function"&&showLoading("\u0110ang x\xF3a \u0111\u01A1n h\xE0ng kh\u1ECFi CSDL...");try{let o=await(await fetch(`/api/order?orderCode=${encodeURIComponent(t)}`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t})})).json();if(!o.success)throw new Error(o.error||"X\xF3a th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 x\xF3a v\u0129nh vi\u1EC5n \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),qt(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(n){console.error("executeDeleteOrder error:",n),typeof showToast=="function"&&showToast("L\u1ED7i x\xF3a \u0111\u01A1n: "+(n?.message||n),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}}var _=window;_.renderJourneyBadge=Wt;_.renderHsOrdersList=Pt;_.filterHsOrders=Se;_.loadHistory=Kn;_.viewOrderDetail=Gn;_.canEditOrders=z;_.canDeleteOrders=J;_.canAuthenticateJourney=Ot;_.STANDARD_STEPS=jt;_.renderJourneyTimeline=Vt;_.openOrderJourneyModal=Jn;_.closeOrderJourneyModal=Yn;_.submitJourneyStep=Zn;_.openEditOrderModal=to;_.closeEditOrderModal=Ee;_.renderEditOrderItems=gt;_.updateEditOrderItemQty=eo;_.removeEditOrderItemLine=no;_.addEditOrderItemLine=oo;_.recalcEditOrderTotals=Te;_.saveEditOrder=ao;_.confirmDeleteOrder=ro;_.closeDeleteOrderModal=qt;_.executeDeleteOrder=so;function Ie(t){return t==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse":t==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800":"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"}function io(t){return t==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800":t==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800":"bg-gray-50 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300 border-gray-200/70 dark:border-gray-700/60"}function lo(t,n){return t<=0?n<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`${t} ng\xE0y`}function co(t,n){return t<=0?n<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`C\xF2n ${t} ng\xE0y`}function _e(t){return t==="red"?"text-rose-600 dark:text-rose-400":t==="yellow"?"text-amber-600 dark:text-amber-400":"text-emerald-600 dark:text-emerald-400"}function uo(t){return t==="red"?"text-rose-600 dark:text-rose-400":t==="yellow"?"text-amber-600 dark:text-amber-400":"text-gray-900 dark:text-white"}function wt(t){return t.batch_code||t.batch_no||t.site_code||"KHO"}function vt(t){return t.unit||t.uom||"Ph\u1EA7n"}function mt(t){return typeof t=="number"?t:parseFloat(t||"0")||0}function Me(t){let n=mt(t);return L(n,2)}var A=1,Ut=10,Xt="fefo_priority",kt="asc",N=new Set;function po(){return N}function go(){return A}function mo(t){A=t}function $e(t){let n=document.getElementById("fefoTableBody"),o=document.getElementById("fefoMobileCards");if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}n&&(n.innerHTML=t.map(e=>{let a=Ie(e.danger_level),i=io(e.danger_level),r=N.has(e.sku),s=wt(e),l=vt(e),d=e.exp_date?e.exp_date.slice(0,10):"\u2014",c=mt(e.qty),u=e.days_remaining!==void 0?e.days_remaining:e.days_left!==void 0?e.days_left:45,g=lo(u,c),b=_e(e.danger_level),y=(e.item_name||"").replace(/'/g,"\\'"),p=e.fefo_priority??1;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3.5 text-center whitespace-nowrap">
            <input type="checkbox" class="stock-row-checkbox rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer" data-sku="${e.sku}" onchange="toggleStockItemSelect('${e.sku}', this.checked)" ${r?"checked":""}>
          </td>
          <td class="p-3.5 text-center whitespace-nowrap">
            <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs mx-auto">${p}</span>
          </td>
          <td class="p-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${e.sku}')" class="text-brand-500 dark:text-brand-400 hover:underline" title="Xem chi ti\u1EBFt k\u1EF9 thu\u1EADt">
              ${e.sku}
            </a>
          </td>
          <td class="p-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[180px]">${e.item_name}</td>
          <td class="p-3.5 whitespace-nowrap">
            <span class="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-xs font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60">${s}</span>
          </td>
          <td class="p-3.5 whitespace-nowrap min-w-[130px]">
            <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-xs font-semibold border ${i}">
              <i data-lucide="calendar" class="w-3.5 h-3.5 shrink-0 opacity-70"></i>
              <span>${d}</span>
            </div>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap min-w-[110px]">
            ${Me(c)} <span class="font-sans text-xs font-normal text-gray-500">${l}</span>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold whitespace-nowrap min-w-[95px] ${b}">${g}</td>
          <td class="p-3.5 text-center whitespace-nowrap min-w-[110px]">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${a}">${e.status_text||"An to\xE0n"}</span>
          </td>
          <td class="p-3.5 text-right whitespace-nowrap min-w-[120px]">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${e.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi ti\u1EBFt k\u1EF9 thu\u1EADt">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openEditItemModal('${e.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Ch\u1EC9nh s\u1EEDa \u0111\u1ECBnh m\u1EE9c an to\xE0n">
                <i data-lucide="edit-3" class="w-4 h-4"></i>
              </button>
              <button onclick="openIssueModal('${e.sku}', '${y}', '${s}', ${c})" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all">
                <i data-lucide="package-minus" class="w-3.5 h-3.5"></i> Xu\u1EA5t B\u1EBFp
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(e=>{let a=Ie(e.danger_level),i=wt(e),r=vt(e),s=e.exp_date?e.exp_date.slice(0,10):"\u2014",l=mt(e.qty),d=e.days_remaining!==void 0?e.days_remaining:e.days_left!==void 0?e.days_left:45,c=co(d,l),u=uo(e.danger_level),g=_e(e.danger_level),b=(e.item_name||"").replace(/'/g,"\\'");return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">P${e.fefo_priority??1}</span>
              <span class="font-bold text-xs text-gray-900 dark:text-white truncate">${e.item_name}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 whitespace-nowrap ${a}">${e.status_text||c}</span>
          </div>
          <div class="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400 text-xs">
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">M\xE3 SKU</div>
              <div class="font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap truncate">${e.sku}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">M\xE3 L\xF4 / \u0110i\u1EC3m B\xE1n</div>
              <div class="font-mono font-semibold text-gray-900 dark:text-white whitespace-nowrap truncate">${i}</div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">H\u1EA1n D\xF9ng (EXP)</div>
              <div class="inline-flex items-center gap-1 font-mono font-bold text-xs whitespace-nowrap ${u}">
                <i data-lucide="calendar" class="w-3 h-3 shrink-0 opacity-70"></i>
                <span>${s}</span>
              </div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">T\xECnh Tr\u1EA1ng H\u1EA1n</div>
              <div class="font-mono font-bold text-xs whitespace-nowrap ${g}">${c}</div>
            </div>
            <div class="col-span-2 flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-gray-800">
              <span class="text-xs text-gray-500 font-medium">T\u1ED3n kh\u1EA3 d\u1EE5ng:</span>
              <span class="font-mono font-bold text-sm whitespace-nowrap ${l<0?"text-rose-600":"text-brand-500 dark:text-brand-400"}">${Me(l)} <span class="font-sans text-xs font-normal text-gray-500">${r}</span></span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1">
            <button onclick="openItemDetailModal('${e.sku}')" class="px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">Chi ti\u1EBFt</button>
            <button onclick="openIssueModal('${e.sku}', '${b}', '${i}', ${l})" class="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"><i data-lucide="package-minus" class="w-3 h-3"></i> Xu\u1EA5t B\u1EBFp</button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function ot(){let t=(document.getElementById("fefoSearchInput")?.value||"").toLowerCase().trim(),n=document.getElementById("fefoCategoryFilter")?.value||"",o=document.getElementById("fefoStatusFilter")?.value||"",a=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(y=>{let p=!t||y.sku&&y.sku.toLowerCase().includes(t)||y.item_name&&y.item_name.toLowerCase().includes(t)||y.batch_code&&y.batch_code.toLowerCase().includes(t)||y.batch_no&&y.batch_no.toLowerCase().includes(t),h=!n||y.category===n||!!y.category&&y.category.includes(n),m=!0;return o==="safe"?m=y.danger_level==="green":o==="yellow"?m=y.danger_level==="yellow":o==="red"?m=y.danger_level==="red":o&&(m=y.danger_level===o),p&&h&&m});a.sort((y,p)=>{let h=y[Xt]??"",m=p[Xt]??"";return typeof h=="number"&&typeof m=="number"?kt==="asc"?h-m:m-h:kt==="asc"?String(h).localeCompare(String(m)):String(m).localeCompare(String(h))});let i=a.length,r=Math.ceil(i/Ut)||1;A>r&&(A=r),A<1&&(A=1);let s=(A-1)*Ut,l=a.slice(s,s+Ut),d=document.getElementById("stockPageEnd");d&&(d.textContent=String(Math.min(s+Ut,i)));let c=document.getElementById("stockTotalCount");c&&(c.textContent=String(i));let u=document.getElementById("stockCurrentPageBadge");u&&(u.textContent=`${A}/${r}`);let g=document.getElementById("stockPrevBtn");g&&(g.disabled=A<=1);let b=document.getElementById("stockNextBtn");b&&(b.disabled=A>=r),$e(l)}function fo(t){A+=t,ot()}function ho(t){Xt===t?kt=kt==="asc"?"desc":"asc":(Xt=t,kt="asc"),ot()}function bo(){let t=document.getElementById("fefoSearchInput");t&&(t.value="");let n=document.getElementById("fefoCategoryFilter");n&&(n.value="");let o=document.getElementById("fefoStatusFilter");o&&(o.value=""),A=1,ot()}function yo(t){document.querySelectorAll(".stock-row-checkbox").forEach(o=>{o.checked=t;let e=o.dataset.sku;e&&(t?N.add(e):N.delete(e))}),Lt()}function xo(t,n){n?N.add(t):N.delete(t),Lt()}function Lt(){let t=document.getElementById("stockBulkActionBar"),n=document.getElementById("selectedStockCount");t&&(N.size>0?(t.classList.remove("hidden"),n&&(n.textContent=String(N.size))):t.classList.add("hidden"))}function wo(){N.clear();let t=document.getElementById("selectAllStockCheckbox");t&&(t.checked=!1),document.querySelectorAll(".stock-row-checkbox").forEach(n=>{n.checked=!1}),Lt()}var Kt=null;async function Gt(){try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",o=await(await fetch(`/api/stock?branch=${encodeURIComponent(t)}`)).json();if(o.success){typeof App<"u"&&(App.fefoItems=o.data||[]);let e=document.getElementById("fefoCategoryFilter"),a=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(e&&a.length){let i=e.value,r=Array.from(new Set(a.map(s=>s.category).filter(Boolean))).sort();e.innerHTML='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>'+r.map(s=>`<option value="${s}">${s}</option>`).join(""),i&&r.includes(i)&&(e.value=i)}ot()}}catch(t){console.error("Error loading FEFO stock:",t)}}function vo(){let t=document.getElementById("modalFastReceipt");t&&t.classList.remove("hidden")}function ko(t,n,o,e){let a=document.getElementById("issueSku");a&&(a.value=t);let i=document.getElementById("issueBatchLabel");i&&(i.innerHTML=`<b>${t}</b> - ${n} <br>L\xF4: <b>${o}</b> (Kh\u1EA3 d\u1EE5ng: ${e})`);let r=document.getElementById("modalFastIssue");r&&r.classList.remove("hidden")}function St(t){let n=document.getElementById(t);n&&n.classList.add("hidden")}async function Lo(){typeof showLoading=="function"&&showLoading("\u0110ang ghi nh\u1EADn nh\u1EADp kho...");try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",n=document.getElementById("recSku"),o=document.getElementById("recBatch"),e=document.getElementById("recMfg"),a=document.getElementById("recExp"),i=document.getElementById("recQty"),r=document.getElementById("recLoc"),s={branch_code:t,sku:n?n.value:"",batch_code:o&&o.value?o.value:"BAT-"+Date.now().toString().slice(-4),mfg_date:e?e.value:"",exp_date:a?a.value:"",qty:i?i.value:"0",storage_loc:r?r.value:""},d=await(await fetch("/api/stock/receipt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();d.success?(St("modalFastReceipt"),typeof showToast=="function"&&showToast("Nh\u1EADp kho l\xF4 m\u1EDBi th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),Gt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+d.error)}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}async function So(){typeof showLoading=="function"&&showLoading("\u0110ang th\u1EF1c hi\u1EC7n xu\u1EA5t kho FEFO...");try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",n=document.getElementById("issueSku"),o=document.getElementById("issueQty"),e=document.getElementById("issueNote"),a={branch_code:t,sku:n?n.value:"",qty_needed:o?o.value:"0",note:e?e.value:""},r=await(await fetch("/api/stock/issue",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).json();r.success?(St("modalFastIssue"),typeof showToast=="function"&&showToast("Xu\u1EA5t kho chu\u1EA9n FEFO th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),Gt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+r.error)}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}function Co(t){let o=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(l=>l.sku===t);if(!o)return;let e=document.getElementById("editItemSku"),a=document.getElementById("editItemName"),i=document.getElementById("editItemSafetyStock"),r=document.getElementById("editItemUnit");e&&(e.value=o.sku),a&&(a.value=`${o.sku} - ${o.item_name}`),i&&(i.value=String(o.safety_stock||5)),r&&(r.value=o.unit||o.uom||"Can 5L");let s=document.getElementById("modalEditItem");s&&s.classList.remove("hidden")}function Eo(){let t=document.getElementById("editItemSku"),n=document.getElementById("editItemSafetyStock"),o=document.getElementById("editItemUnit"),e=t?t.value:"",a=n&&parseFloat(n.value)||5,i=o?o.value:"",s=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(l=>l.sku===e);s&&(s.safety_stock=a,s.unit=i),St("modalEditItem"),typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u1ECBnh m\u1EE9c an to\xE0n cho ${e}!`),ot()}async function To(t){try{let n=document.getElementById("modalInventoryDetail");if(!n)return;n.classList.remove("hidden");let o=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",a=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(p=>p.sku===t);if(!a){let h=await(await fetch(`/api/stock?branch=${encodeURIComponent(o)}`)).json();h.success&&h.data&&(a=h.data.find(m=>m.sku===t))}a||(a={sku:t,item_name:t,category:"Gia v\u1ECB",unit:"\u0110\u01A1n v\u1ECB",qty:12,safety_stock:5,standard_cost_sap:185e3,lead_time_hours:24});let i=document.getElementById("detailItemSku");i&&(i.textContent=a.sku);let r=document.getElementById("detailItemName");r&&(r.textContent=a.item_name||a.sku);let s=document.getElementById("detailItemUnit");s&&(s.textContent=a.unit||a.uom||"\u0110\u01A1n v\u1ECB");let l=document.getElementById("detailBadgeCategory");l&&(l.textContent=(a.sku.slice(0,2)||"GV").toUpperCase());let d=document.getElementById("detailQty");d&&(d.textContent=`${a.qty||0} ${a.unit||a.uom||""}`);let c=document.getElementById("detailSafetyStock");c&&(c.textContent=`${a.safety_stock||5} ${a.unit||a.uom||""}`);let u=document.getElementById("detailStandardCost");u&&(u.textContent=H(Number(a.standard_cost_sap)||185e3));let g=document.getElementById("detailLeadTime");g&&(g.textContent=`${a.lead_time_hours||24}h`);let b=document.getElementById("itemDetailStockChart");if(b&&typeof ApexCharts<"u"){Kt&&Kt.destroy();let p=typeof isDarkModeActive=="function"?isDarkModeActive():!1,m={series:[{name:"T\u1ED3n kho th\u1EF1c t\u1EBF",data:[15,14,16,12,11,14,13,15,14,12,typeof a.qty=="number"?a.qty:parseFloat(String(a.qty))||10]}],colors:["#19723C"],chart:{fontFamily:"'Be Vietnam Pro', sans-serif",type:"area",height:180,toolbar:{show:!1},sparkline:{enabled:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:2.5},fill:{type:"gradient",gradient:{shadeIntensity:1,opacityFrom:.35,opacityTo:.05,stops:[0,95,100]}},xaxis:{categories:["09/11","10/11","11/11","12/11","13/11","14/11","15/11","16/11","17/11","18/11","19/11"],labels:{style:{colors:p?"#94A3B8":"#64748B",fontSize:"10px"}}},yaxis:{labels:{style:{colors:p?"#94A3B8":"#64748B",fontSize:"10px"}}},grid:{borderColor:p?"#1E293B":"#F1F5F9",strokeDashArray:3}};Kt=new ApexCharts(b,m),Kt.render()}let y=document.getElementById("detailTransactionsBody");y&&(y.innerHTML=`
        <tr>
          <td colspan="5" class="py-6 text-center text-gray-400 dark:text-gray-500 text-xs">
            Ch\u01B0a c\xF3 ph\xE1t sinh giao d\u1ECBch cho m\u1EB7t h\xE0ng n\xE0y.
          </td>
        </tr>
      `),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(n){console.error("Error opening item detail:",n)}}function Io(t,n,o){let a=[["\u01AFu Ti\xEAn FEFO","M\xE3 SKU","T\xEAn M\u1EB7t H\xE0ng","M\xE3 L\xF4","H\u1EA1n D\xF9ng (EXP)","S\u1ED1 L\u01B0\u1EE3ng T\u1ED3n","\u0110\u01A1n V\u1ECB","S\u1ED1 Ng\xE0y C\xF2n","Tr\u1EA1ng Th\xE1i"]];o.forEach(l=>{let d=l.fefo_priority??1,c=l.sku||"",u=l.item_name||"",g=wt(l),b=l.exp_date?l.exp_date.slice(0,10):"\u2014",y=mt(l.qty),p=vt(l),h=l.days_remaining!==void 0?l.days_remaining:l.days_left!==void 0?l.days_left:45,m=l.status_text||"An to\xE0n";a.push([d,c,u,g,b,y,p,h,m])});let i=XLSX.utils.book_new(),r=XLSX.utils.aoa_to_sheet(a),s=XLSX.utils.decode_range(r["!ref"]);r["!cols"]=[{wch:14},{wch:14},{wch:34},{wch:16},{wch:16},{wch:14},{wch:10},{wch:14},{wch:16}];for(let l=s.s.r;l<=s.e.r;++l)for(let d=s.s.c;d<=s.e.c;++d){let c=XLSX.utils.encode_cell({r:l,c:d});if(r[c])if(l===0)r[c].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let u="left",g;d===0||d===1||d===3||d===4||d===6||d===8?u="center":(d===5||d===7)&&(u="right",d===5&&(g="#,##0.00"),d===7&&(g="#,##0"));let b=d===5&&typeof r[c].v=="number"&&r[c].v<0;r[c].s={font:{name:"Aptos",sz:11,bold:!1,color:{rgb:b?"C00000":"000000"}},alignment:{horizontal:u,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},g&&(r[c].z=g)}}r["!freeze"]={xSplit:0,ySplit:1},r["!autofilter"]={ref:r["!ref"]},XLSX.utils.book_append_sheet(i,r,n),XLSX.writeFile(i,t)}function _o(){let t=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(!t||!t.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}Io("Danh_Sach_Ton_Kho_FEFO.xlsx","TonKhoFEFO",t)}function Mo(){if(N.size===0){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t Excel!");return}let n=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(o=>N.has(o.sku));Io("Ton_Kho_Duoc_Chon.xlsx","DuocChon",n)}if(typeof window<"u"){let t=window;t.renderFefoRows=$e,t.filterFefoLive=ot,t.changeStockPage=fo,t.sortStockBy=ho,t.resetFefoFilters=bo,t.toggleSelectAllStock=yo,t.toggleStockItemSelect=xo,t.updateStockBulkBar=Lt,t.clearStockSelection=wo,t.selectedStockSkus=N,t.getSelectedStockSkus=po,t.getStockCurrentPage=go,t.setStockCurrentPage=mo,t.loadStockFEFO=Gt,t.openReceiptModal=vo,t.openIssueModal=ko,t.closeModal=St,t.submitReceiptToBackend=Lo,t.submitIssueToBackend=So,t.openEditItemModal=Co,t.saveItemSpecs=Eo,t.openItemDetailModal=To,t.exportFefoToExcel=_o,t.exportSelectedStockExcel=Mo}function Be(t){let n=document.getElementById("ropTableBody"),o=document.getElementById("ropMobileCards");if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="9" class="p-8 text-center text-emerald-600 dark:text-emerald-400 font-medium">T\u1EA5t c\u1EA3 m\u1EB7t h\xE0ng t\u1EA1i \u0111i\u1EC3m kho n\xE0y \u0111\u1EC1u \u0111\u1EA1t ng\u01B0\u1EE1ng t\u1ED3n an to\xE0n (Kh\xF4ng c\u1EA7n \u0111\u1EB7t th\xEAm).</td></tr>'),o&&(o.innerHTML='<div class="p-6 text-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">T\u1EA5t c\u1EA3 m\u1EB7t h\xE0ng t\u1EA1i \u0111i\u1EC3m kho n\xE0y \u0111\u1EC1u \u0111\u1EA1t ng\u01B0\u1EE1ng t\u1ED3n an to\xE0n.</div>');return}n&&(n.innerHTML=t.map(e=>{let a=e.sku||"",i=e.item_name||a,r=e.unit||e.uom||"Ph\u1EA7n",s=parseFloat(String(e.daily_usage!==void 0?e.daily_usage:10)),l=e.lead_time_days!==void 0?parseFloat(String(e.lead_time_days)):e.lead_time_hours?Math.round(parseFloat(String(e.lead_time_hours))/24):2,d=parseFloat(String(e.safety_stock!==void 0?e.safety_stock:5)),c=parseFloat(String(e.current_stock!==void 0?e.current_stock:0)),u=parseFloat(String(e.rop!==void 0?e.rop:e.rop_threshold!==void 0?e.rop_threshold:25)),g=parseFloat(String(e.suggested_order!==void 0?e.suggested_order:e.suggested_order_qty!==void 0?e.suggested_order_qty:c<u?Math.max(0,35-c):0)),b=e.status||(c<=0?"H\u1EBET H\xC0NG":c<u?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N"),y="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold";return b==="H\u1EBET H\xC0NG"?y="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold":b==="C\u1EA6N \u0110\u1EB6T"&&(y="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold animate-pulse"),`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 text-center font-mono tabular-nums font-bold text-gray-800 dark:text-gray-200 text-xs">${a}</td>
          <td class="p-3 font-semibold text-gray-900 dark:text-white text-xs">${i}</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${L(s,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${l} ng\xE0y</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${L(d,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${c<=0?"text-rose-600":"text-gray-900 dark:text-white"} text-xs">${L(c,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400 text-xs">${L(u,1)} <span class="text-[11px] text-amber-600/70 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${g>0?"text-brand-600 dark:text-brand-400":"text-gray-400"} text-xs">${g>0?"+"+L(g,1):"0"} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] ${y}">${b}</span>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(e=>{let a=e.sku||"",i=e.item_name||a,r=e.unit||e.uom||"Ph\u1EA7n",s=e.lead_time_days!==void 0?parseFloat(String(e.lead_time_days)):e.lead_time_hours?Math.round(parseFloat(String(e.lead_time_hours))/24):2,l=parseFloat(String(e.current_stock!==void 0?e.current_stock:0)),d=parseFloat(String(e.rop!==void 0?e.rop:e.rop_threshold!==void 0?e.rop_threshold:25)),c=parseFloat(String(e.suggested_order!==void 0?e.suggested_order:e.suggested_order_qty!==void 0?e.suggested_order_qty:l<d?Math.max(0,35-l):0)),u=e.status||(l<=0?"H\u1EBET H\xC0NG":l<d?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N"),g="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200";return u==="H\u1EBET H\xC0NG"?g="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200":u==="C\u1EA6N \u0110\u1EB6T"&&(g="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200"),`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-xs text-gray-900 dark:text-white">${i}</div>
              <div class="text-[11px] font-mono text-gray-400 mt-0.5">SKU: ${a}</div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${g}">${u}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>T\u1ED3n hi\u1EC7n t\u1EA1i: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${L(l,1)} ${r}</b></div>
            <div>\u0110i\u1EC3m ROP: <b class="font-mono tabular-nums text-amber-600 dark:text-amber-400">${L(d,1)} ${r}</b></div>
            <div>Lead time: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${s} ng\xE0y</b></div>
            <div>\u0110\u1EC1 xu\u1EA5t \u0111\u1EB7t: <b class="font-mono tabular-nums font-semibold text-sm ${c>0?"text-brand-600 dark:text-brand-400":"text-gray-500"}">${c>0?"+"+L(c,1):"0"} ${r}</b></div>
          </div>
        </div>
      `}).join(""))}async function $o(){let t=localStorage.getItem("orbit_user_site"),n=document.getElementById("globalBranchSelect")?.value,o=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,e=t||n||o||"K001";(e==="ALL"||e==="all")&&(e="K001"),e=e.toUpperCase();let a=document.getElementById("whRopCurrentSiteBadge");if(a){let l=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(d=>d.code&&d.code.toUpperCase()===e.toUpperCase());a.textContent=l?l.ten||l.name:e}let i=document.getElementById("ropTableBody"),r=document.getElementById("ropMobileCards");i&&(i.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400">\u0110ang t\xEDnh to\xE1n ng\u01B0\u1EE1ng an to\xE0n ROP...</td></tr>'),r&&(r.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\xEDnh to\xE1n ng\u01B0\u1EE1ng an to\xE0n ROP...</div>');try{let l=await(await fetch(`/api/reorder?site=${encodeURIComponent(e)}&branch=${encodeURIComponent(e)}&nocache=1`)).json();if(l.success){let d=l.data||[];typeof App<"u"&&(App.ropItems=d),Be(d)}else i&&(i.innerHTML=`<tr><td colspan="9" class="p-8 text-center text-rose-500">L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u: ${l.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</td></tr>`),r&&(r.innerHTML=`<div class="p-6 text-center text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-2xl">L\u1ED7i: ${l.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</div>`)}catch(s){console.error("loadReorderROP error:",s),i&&(i.innerHTML=`<tr><td colspan="9" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${s.message}</td></tr>`)}}function Qt(t){let n=document.getElementById("leadTimeTableBody"),o=document.getElementById("leadTimeMobileCards");if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="7" class="p-8 text-center text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n PO n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 K\u1EF3 th\xE1ng \u0111\xE3 ch\u1ECDn.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n PO n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 K\u1EF3 th\xE1ng \u0111\xE3 ch\u1ECDn.</div>');return}n&&(n.innerHTML=t.map(e=>{let a=e.supplier_name||e.vendor_name||"B\u1EBFp Trung T\xE2m Siba Food",i=e.order_date||(e.order_time?e.order_time.split(" ")[0]:"\u2014"),r=e.actual_delivery_date||(e.received_time?e.received_time.split(" ")[0]:"\u2014"),s=e.actual_lead_time_days!==null&&e.actual_lead_time_days!==void 0?e.actual_lead_time_days+" ng\xE0y":e.lead_time_hours?e.lead_time_hours+"h":"\u2014",l=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N"),d=l==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA",c=l==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao",u=d?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200":c?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200":"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 font-mono tabular-nums font-bold text-gray-900 dark:text-white">${e.po_number}</td>
          <td class="p-3 font-mono tabular-nums font-bold text-brand-600 dark:text-brand-400">
            <span class="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60">${e.branch_code||e.site||"\u2014"}</span>
          </td>
          <td class="p-3 font-bold text-gray-800 dark:text-gray-200">${a}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${i}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${r}</td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${!d&&!c?"text-rose-600":"text-emerald-600"}">${s}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${u}">${l}</span>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(e=>{let a=e.supplier_name||e.vendor_name||"B\u1EBFp Trung T\xE2m Siba Food",i=e.order_date||(e.order_time?e.order_time.split(" ")[0]:"\u2014"),r=e.actual_delivery_date||(e.received_time?e.received_time.split(" ")[0]:"\u2014"),s=e.committed_lead_time_days?e.committed_lead_time_days+" ng\xE0y":e.sla_target_hours?e.sla_target_hours+"h":"24h",l=e.actual_lead_time_days!==null&&e.actual_lead_time_days!==void 0?e.actual_lead_time_days+" ng\xE0y":e.lead_time_hours?e.lead_time_hours+"h":"\u2014",d=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N"),c=d==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA",u=d==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao",g=c?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200":u?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200":"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200";return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-xs text-gray-900 dark:text-white">${a}</div>
              <div class="text-xs font-mono tabular-nums text-gray-400">PO: ${e.po_number} \xB7 \u0110i\u1EC3m: <b class="text-brand-600 dark:text-brand-400">${e.branch_code||e.site||"\u2014"}</b></div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${g}">${d}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${i}</b></div>
            <div>Ng\xE0y nh\u1EADn: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${r}</b></div>
            <div>Cam k\u1EBFt SLA: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${s}</b></div>
            <div>Lead time th\u1EF1c t\u1EBF: <b class="font-mono tabular-nums font-bold ${!c&&!u?"text-rose-600":"text-emerald-600"}">${l}</b></div>
          </div>
        </div>
      `}).join(""))}function He(t){let n=typeof App<"u"&&App.leadTimeRawData?App.leadTimeRawData:[];if(!t||t==="ALL"){Qt(n);return}let o=n.filter(e=>{let a=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N");return t==="ON_TIME"?a==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA":t==="DELIVERING"?a==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao":t==="LATE"?a==="TR\u1EC4 H\u1EA0N"||e.sla_status==="Tr\u1EC5 h\u1EB9n NCC":!0});Qt(o)}async function Bo(){let t=document.getElementById("globalBranchSelect")?.value,o=((typeof App<"u"&&App.currentBranch?App.currentBranch:"")||t||"").toUpperCase(),e=document.getElementById("leadTimeMonth")?.value||"",a=new URLSearchParams;o&&o!=="ALL"&&a.set("site",o),e&&a.set("month",e);let i=a.toString()?`/api/leadtime?${a.toString()}`:"/api/leadtime";try{let s=await(await fetch(i)).json(),l=s.success&&s.data?s.data:[];typeof App<"u"&&(App.leadTimeRawData=l);let d=document.getElementById("leadTimeSlaFilter")?.value||"ALL";He(d)}catch(r){console.error("Error loading Lead Time:",r)}}function Ho(){let t=typeof App<"u"&&App.ropItems?App.ropItems:[];if(!t||!t.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u c\u1EA3nh b\xE1o ROP \u0111\u1EC3 xu\u1EA5t Excel!");return}let o=[["M\xE3 SKU","T\xEAn Gia V\u1ECB / M\u1EB7t H\xE0ng","\u0110VT","Ti\xEAu Th\u1EE5/Ng\xE0y","Lead Time (ng\xE0y)","T\u1ED3n An To\xE0n","T\u1ED3n Hi\u1EC7n T\u1EA1i","Ng\u01B0\u1EE1ng ROP","\u0110\u1EC1 Xu\u1EA5t \u0110\u1EB7t","Tr\u1EA1ng Th\xE1i"]];t.forEach(r=>{let s=r.sku||"",l=r.item_name||s,d=r.unit||r.uom||"Ph\u1EA7n",c=parseFloat(String(r.daily_usage!==void 0?r.daily_usage:10)),u=r.lead_time_days!==void 0?parseFloat(String(r.lead_time_days)):r.lead_time_hours?Math.round(parseFloat(String(r.lead_time_hours))/24):2,g=parseFloat(String(r.safety_stock!==void 0?r.safety_stock:5)),b=parseFloat(String(r.current_stock!==void 0?r.current_stock:0)),y=parseFloat(String(r.rop!==void 0?r.rop:r.rop_threshold!==void 0?r.rop_threshold:25)),p=parseFloat(String(r.suggested_order!==void 0?r.suggested_order:r.suggested_order_qty!==void 0?r.suggested_order_qty:b<y?Math.max(0,35-b):0)),h=r.status||(b<=0?"H\u1EBET H\xC0NG":b<y?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N");o.push([s,l,d,c,u,g,b,y,p,h])});let e=XLSX.utils.book_new(),a=XLSX.utils.aoa_to_sheet(o),i=XLSX.utils.decode_range(a["!ref"]);a["!cols"]=[{wch:14},{wch:34},{wch:10},{wch:14},{wch:16},{wch:14},{wch:14},{wch:14},{wch:14},{wch:16}];for(let r=i.s.r;r<=i.e.r;++r)for(let s=i.s.c;s<=i.e.c;++s){let l=XLSX.utils.encode_cell({r,c:s});if(a[l])if(r===0)a[l].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let d="left",c;s===0||s===2||s===9?d="center":s>=3&&s<=8&&(d="right",c="#,##0.0",(s===4||s===8)&&(c="#,##0"));let u=s===6&&typeof a[l].v=="number"&&a[l].v<=0;a[l].s={font:{name:"Aptos",sz:11,bold:s===6||s===8,color:{rgb:u?"C00000":"000000"}},alignment:{horizontal:d,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},c&&(a[l].z=c)}}a["!freeze"]={xSplit:0,ySplit:1},a["!autofilter"]={ref:a["!ref"]},XLSX.utils.book_append_sheet(e,a,"ROP"),XLSX.writeFile(e,"De_Xuat_Dat_Hang_ROP.xlsx")}if(typeof window<"u"){let t=window;t.loadReorderROP=$o,t.renderRopTable=Be,t.loadLeadTime=Bo,t.renderLeadTimeTable=Qt,t.filterLeadTimeSla=He,t.downloadRopExcel=Ho}function Ne(t){let n=t?"#94A3B8":"#64748B",o=t?"#1E293B":"#F1F5F9";if(typeof chartInboundOutbound<"u"&&chartInboundOutbound)try{chartInboundOutbound.updateOptions({chart:{foreColor:n},grid:{borderColor:o},xaxis:{labels:{style:{colors:n}}},yaxis:{labels:{style:{colors:n}}},tooltip:{theme:t?"dark":"light"}})}catch{}if(typeof chartSafetyGauge<"u"&&chartSafetyGauge)try{chartSafetyGauge.updateOptions({plotOptions:{radialBar:{track:{background:t?"#1C243D":"#E8EAEE"},dataLabels:{value:{color:t?"#FFFFFF":"#1D2939"}}}}})}catch{}if(typeof chartValueTrend<"u"&&chartValueTrend)try{chartValueTrend.updateOptions({chart:{foreColor:n},grid:{borderColor:o},xaxis:{labels:{style:{colors:n}}},yaxis:{labels:{style:{colors:n}}}})}catch{}}function Fe(t){let n=document.getElementById("stockAlertsTableBody"),o=document.getElementById("dashStockAlertsMobileCards");if(!n&&!o)return;if(!t||t.length===0){n&&(n.innerHTML=`
        <tr>
          <td colspan="7" class="px-5 py-6 text-center text-gray-400 dark:text-gray-500">
            <i data-lucide="check-circle" class="w-5 h-5 text-emerald-500 inline-block mb-1"></i>
            <p class="font-medium text-xs">Hi\u1EC7n t\u1EA1i kh\xF4ng c\xF3 c\u1EA3nh b\xE1o vi ph\u1EA1m an to\xE0n kho!</p>
          </td>
        </tr>
      `),o&&(o.innerHTML=`
        <div class="card p-6 text-center text-gray-400 dark:text-gray-500">
          <i data-lucide="check-circle" class="w-6 h-6 text-emerald-500 mx-auto mb-2"></i>
          <p class="font-medium text-sm">Hi\u1EC7n t\u1EA1i kh\xF4ng c\xF3 c\u1EA3nh b\xE1o vi ph\u1EA1m an to\xE0n kho!</p>
        </div>
      `),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();return}n&&(n.innerHTML=t.map(a=>{let i="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900/40",r="B\xECnh th\u01B0\u1EDDng";return a.alert_level==="OUT_OF_STOCK"?(i="bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400 border border-rose-200 dark:border-rose-900/40 font-bold",r="H\u1EBFt h\xE0ng"):a.alert_level==="NEAR_EXPIRY"?(i="bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400 border border-amber-200 dark:border-amber-900/40 font-bold",r=`C\u1EADn Date (${a.days_left||0}d)`):a.alert_level==="LOW_STOCK"&&(i="bg-yellow-50 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-900/40 font-bold",r="D\u01B0\u1EDBi m\u1EE9c an to\xE0n"),`
        <tr class="hover:bg-gray-50/60 dark:hover:bg-white/2 transition-colors">
          <td class="px-5 py-3.5 font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            <a href="javascript:void(0)" onclick="openItemDetailModal('${a.sku}')" class="text-brand-500 hover:underline flex items-center gap-1">
              ${a.sku}
            </a>
          </td>
          <td class="px-5 py-3.5 font-medium text-gray-800 dark:text-gray-100 min-w-[160px]">
            <div>${a.item_name||a.sku}</div>
            <span class="text-xs text-gray-400 font-normal">${a.category||"Gia v\u1ECB"} \u2022 ${a.unit||"\u0110\u01A1n v\u1ECB"}</span>
          </td>
          <td class="px-5 py-3.5 whitespace-nowrap min-w-[155px]">
            <div class="font-mono text-xs font-semibold text-gray-800 dark:text-gray-200">${a.batch_code||"L\xF4 kho"}</div>
            <div class="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-rose-600 dark:text-rose-400 mt-1 px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 whitespace-nowrap">
              <i data-lucide="calendar" class="w-3 h-3 shrink-0"></i>
              <span>EXP: ${a.exp_date?a.exp_date.slice(0,10):"Ch\u01B0a c\xF3"}</span>
            </div>
          </td>
          <td class="px-5 py-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap">
            ${a.qty} ${a.unit||""}
          </td>
          <td class="px-5 py-3.5 text-right font-mono text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
            ${a.safety_stock||5} ${a.unit||""}
          </td>
          <td class="px-5 py-3.5 text-center whitespace-nowrap">
            <span class="inline-flex items-center rounded-lg px-2.5 py-0.5 text-xs font-semibold ${i}">
              ${r}
            </span>
          </td>
          <td class="px-5 py-3.5 text-right whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5 justify-end">
              <button onclick="openItemDetailModal('${a.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-brand-500 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Xem chi ti\u1EBFt">
                <i data-lucide="eye" class="w-4 h-4"></i>
              </button>
              <button onclick="openReceiptModal('${a.sku}')" class="p-1.5 rounded-lg text-gray-500 hover:text-emerald-600 hover:bg-gray-100 dark:hover:bg-white/5 transition-all" title="Nh\u1EADp b\u1ED5 sung">
                <i data-lucide="package-plus" class="w-4 h-4"></i>
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(a=>{let i="badge-neutral",r="B\xECnh th\u01B0\u1EDDng";return a.alert_level==="OUT_OF_STOCK"?(i="badge-danger",r="H\u1EBFt h\xE0ng"):a.alert_level==="NEAR_EXPIRY"?(i="badge-warning",r=`C\u1EADn Date (${a.days_left||0}d)`):a.alert_level==="LOW_STOCK"&&(i="badge-warning",r="D\u01B0\u1EDBi m\u1EE9c an to\xE0n"),`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="code font-bold text-brand-600 dark:text-brand-400">${f(a.sku||"")}</span>
              <span class="badge ${i}">${r}</span>
            </div>
            <span class="text-xs text-gray-400">${f(a.batch_code||"L\xF4 kho")}</span>
          </div>
          <div class="data-card-body space-y-1.5">
            <div class="font-semibold text-sm text-gray-900 dark:text-white">${f(a.item_name||a.sku||"")}</div>
            <div class="text-xs text-gray-400">${f(a.category||"Gia v\u1ECB")} \u2022 ${f(a.unit||"\u0110VT")}</div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <div>
                <span class="text-gray-400">T\u1ED3n hi\u1EC7n t\u1EA1i:</span>
                <span class="num font-semibold text-gray-900 dark:text-white ml-1">${a.qty} ${f(a.unit||"")}</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400">An to\xE0n:</span>
                <span class="num font-semibold text-amber-600 dark:text-amber-400 ml-1">${a.safety_stock||5} ${f(a.unit||"")}</span>
              </div>
            </div>
            ${a.exp_date?`
              <div class="flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 pt-1">
                <span>H\u1EA1n d\xF9ng:</span>
                <span class="num font-medium">${U(a.exp_date.slice(0,10))}</span>
              </div>
            `:""}
          </div>
          <div class="flex items-center justify-end gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="openItemDetailModal('${a.sku}')" class="btn btn-secondary btn-sm">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Chi ti\u1EBFt
            </button>
            <button onclick="openReceiptModal('${a.sku}')" class="btn btn-primary btn-sm">
              <i data-lucide="package-plus" class="w-3.5 h-3.5"></i> Nh\u1EADp b\u1ED5 sung
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();let e=document.documentElement.classList.contains("dark");Ne(e)}function De(t){typeof renderKpi=="function"&&(renderKpi("dashMetricValue",{value:t.total_value||0,sub:"Theo gi\xE1 b\xECnh qu\xE2n kho"}),renderKpi("dashMetricSkus",{value:t.total_skus||0,unit:"M\xE3",isCurrency:!1,sub:"To\xE0n b\u1ED9 danh m\u1EE5c kho"}),renderKpi("dashMetricRop",{value:t.rop_reorder_count||0,unit:"M\xE3",isCurrency:!1,deltaText:(t.rop_reorder_count||0)>0?`${t.rop_reorder_count} m\xE3 c\u1EA7n \u0111\u1EB7t`:"An to\xE0n",deltaGood:(t.rop_reorder_count||0)===0,sub:"Ch\u1EA1m ng\u01B0\u1EE1ng an to\xE0n"}),renderKpi("dashMetricExp",{value:t.critical_exp_count||0,unit:"L\xF4",isCurrency:!1,deltaText:(t.critical_exp_count||0)>0?`${t.critical_exp_count} l\xF4 xu\u1EA5t g\u1EA5p`:"An to\xE0n",deltaGood:(t.critical_exp_count||0)===0,sub:"\u01AFu ti\xEAn xu\u1EA5t FEFO"}),renderKpi("dashMetricSlow",{value:t.slow_moving_count!==void 0?t.slow_moving_count:0,unit:"M\xE3",isCurrency:!1,sub:"L\u01B0u kho kh\xF4ng bi\u1EBFn \u0111\u1ED9ng"}));let n=document.getElementById("dashLeadTimeText");if(n&&(n.textContent=`${t.avg_lead_time||24.5}h`),typeof chartSafetyGauge<"u"&&chartSafetyGauge&&typeof t.safety_rate<"u")try{chartSafetyGauge.updateSeries([parseFloat(String(t.safety_rate))])}catch{}if(typeof chartInboundOutbound<"u"&&chartInboundOutbound&&t.chart_inbound_outbound){let o=t.chart_inbound_outbound,e=Array.isArray(o.categories)?o.categories:String(o.categories||"").split(" ").filter(Boolean),a=Array.isArray(o.inbound)?o.inbound:String(o.inbound||"").split(" ").filter(Boolean).map(Number),i=Array.isArray(o.outbound)?o.outbound:String(o.outbound||"").split(" ").filter(Boolean).map(Number);if(e.length)try{chartInboundOutbound.updateOptions({xaxis:{categories:e}}),chartInboundOutbound.updateSeries([{name:"Nh\u1EADp kho (Tr \u20AB)",data:a},{name:"Xu\u1EA5t kho (Tr \u20AB)",data:i}])}catch(r){console.warn("Chart update notice:",r)}}Fe(t.alerts||[])}async function No(){try{let t=(typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL").toUpperCase(),n=document.getElementById("dashBranchTitle");n&&(n.textContent=t&&t!=="ALL"?t:"To\xE0n Chu\u1ED7i");let e=await(await fetch(`/api/dashboard-summary?branch=${encodeURIComponent(t)}&refresh=true`)).json();if(e.success){let a=e.data;De(a);let i=document.getElementById("dashCritCount");i&&(i.textContent=String(a.critical_exp_count||0));let r=document.getElementById("dashRopCount");r&&(r.textContent=String(a.rop_reorder_count||0));let s=document.getElementById("dashLeadTime");s&&(s.textContent=`${a.avg_lead_time||24.5}h`);let l=document.getElementById("dashTotalQty");l&&(l.textContent=L(a.total_qty||0,1));let d=document.getElementById("dashTotalSkus");d&&(d.textContent=`${a.total_skus||0} SKU \u0111ang qu\u1EA3n l\xFD`);let c=document.getElementById("badgeCritNav");c&&(c.textContent=String(a.critical_exp_count||0));let u=document.getElementById("badgeRopNav");u&&(u.textContent=String(a.rop_reorder_count||0))}}catch(t){console.error("Error loading dashboard summary:",t)}}if(typeof window<"u"){let t=window;t.loadDashboardSummary=No,t.updateTailadminDashboard=De,t.renderStockAlertsTable=Fe,t.updateApexChartsTheme=Ne}var O=[],at=[];function Ps(){return O}function js(){return at}function Re(){let t=(document.getElementById("whInvSearchInput")?.value||"").toLowerCase().trim(),n=document.getElementById("whInvCategorySelect")?.value||"",o=document.getElementById("whInvStatusSelect")?.value||"ALL",e=[...O];t&&(e=e.filter(h=>h.sku&&h.sku.toLowerCase().includes(t)||h.name&&h.name.toLowerCase().includes(t))),n&&(e=e.filter(h=>h.category===n)),o==="HAS_RECEIPT"?e=e.filter(h=>parseFloat(String(h.receipt_qty||0))>0):o==="IN_STOCK"?e=e.filter(h=>parseFloat(String(h.book_qty||0))>0):o==="HAS_BATCH"?e=e.filter(h=>parseInt(String(h.batch_count||0),10)>0):o==="NEGATIVE"&&(e=e.filter(h=>parseFloat(String(h.book_qty||0))<0)),at=e,typeof window<"u"&&(window.gWhFilteredInventory=e);let a=0,i=0,r=0,s=0;e.forEach(h=>{a+=parseFloat(String(h.receipt_qty||0)),i+=parseFloat(String(h.book_qty||0)),r+=parseFloat(String(h.total_value||0)),s+=parseInt(String(h.batch_count||0),10)});let l=document.getElementById("whKpiTotalSkus");l&&(l.textContent=L(e.length,0));let d=document.getElementById("whKpiTotalReceiptQty");d&&(d.textContent=L(Math.round(a*10)/10,1));let c=document.getElementById("whKpiTotalBookQty");c&&(c.textContent=L(Math.round(i*10)/10,1));let u=document.getElementById("whKpiTotalValue");u&&(u.textContent=H(r));let g=document.getElementById("whKpiTotalBatches");g&&(g.textContent=L(s,0));let b=document.getElementById("whInvRowCount");b&&(b.textContent=L(e.length,0));let y=document.getElementById("whInventoryTableBody"),p=document.getElementById("whInventoryMobileCards");if(!e.length){y&&(y.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>'),p&&(p.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</div>');return}y&&(y.innerHTML=e.map((h,m)=>{let w=parseFloat(String(h.receipt_qty||0)),x=parseFloat(String(h.book_qty||0)),v=parseInt(String(h.batch_count||0),10),C="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";return x<0?C="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/80":x>0&&(C="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/80"),`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="px-2 py-2 text-center text-gray-400 tabular-nums font-mono">${m+1}</td>
          <td class="px-2 py-2 whitespace-nowrap">
            <button onclick="openWhItemHistoryModal('${h.sku}')" class="font-mono font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1" title="Xem th\u1EBB kho chi ti\u1EBFt">
              <span>${h.sku}</span>
              <i data-lucide="external-link" class="w-3 h-3 opacity-60"></i>
            </button>
          </td>
          <td class="px-2 py-2 font-semibold text-gray-900 dark:text-white min-w-[150px]">
            <div class="line-clamp-2">${h.name||h.sku}</div>
          </td>
          <td class="px-2 py-2 whitespace-nowrap text-center">
            <span class="px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs font-medium border border-gray-200/60 dark:border-gray-700/60 inline-block max-w-[110px] truncate" title="${h.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}">${h.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}</span>
          </td>
          <td class="px-1.5 py-2 text-center whitespace-nowrap font-medium text-gray-600 dark:text-gray-300">${h.unit||"Ph\u1EA7n"}</td>
          <td class="px-2 py-2 text-right whitespace-nowrap bg-emerald-50/30 dark:bg-emerald-950/10">
            <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs px-1.5 py-0.5 rounded-md bg-emerald-100/60 dark:bg-emerald-900/30 tabular-nums">
              ${L(w,1)}
            </span>
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap bg-blue-50/30 dark:bg-blue-950/10">
            <span class="font-mono font-bold text-xs px-1.5 py-0.5 rounded-md tabular-nums ${C}">
              ${L(x,1)}
            </span>
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
            ${H(Number(h.unit_price)||0)}
          </td>
          <td class="px-2 py-2 text-right whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
            ${H(Number(h.total_value)||0)}
          </td>
          <td class="px-1.5 py-2 text-center whitespace-nowrap">
            <button onclick="openWhItemBatchesModal('${h.sku}')" class="px-1.5 py-0.5 rounded-lg text-xs font-semibold font-mono transition-all ${v>0?"bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 hover:bg-purple-200 border border-purple-200/80 dark:border-purple-800/80":"bg-gray-100 text-gray-400 dark:bg-gray-800 hover:text-gray-600"}" title="Xem chi ti\u1EBFt c\xE1c l\xF4 h\xE0ng">
              ${v>0?v+" L\xF4":"0 L\xF4"}
            </button>
          </td>
          <td class="px-2 py-2 text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1 justify-center">
              <button onclick="openWhItemHistoryModal('${h.sku}')" class="px-1.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-0.5 transition-all" title="Xem th\u1EBB kho l\u1ECBch s\u1EED xu\u1EA5t nh\u1EADp">
                <i data-lucide="history" class="w-3 h-3"></i> Th\u1EBB Kho
              </button>
              <button onclick="openWhItemBatchesModal('${h.sku}')" class="px-1.5 py-1 bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold rounded-lg border border-purple-200 dark:border-purple-800/60 flex items-center gap-0.5 transition-all" title="Xem chi ti\u1EBFt c\xE1c l\xF4 \u0111\xE3 nh\u1EADp">
                <i data-lucide="layers" class="w-3 h-3"></i> L\xF4
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),p&&(p.innerHTML=e.map((h,m)=>{let w=parseFloat(String(h.receipt_qty||0)),x=parseFloat(String(h.book_qty||0)),v=parseInt(String(h.batch_count||0),10);return`
        <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-gray-400 text-xs font-mono">#${m+1}</span>
                <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${h.sku}</span>
                <span class="px-1.5 py-0.2 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">${h.unit||"Ph\u1EA7n"}</span>
              </div>
              <h4 class="font-bold text-xs text-gray-900 dark:text-white mt-1 leading-snug">${h.name||h.sku}</h4>
              <div class="text-xs text-gray-500 mt-0.5">${h.category||"Ch\u01B0a ph\xE2n lo\u1EA1i"}</div>
            </div>
            <button onclick="openWhItemBatchesModal('${h.sku}')" class="px-2 py-1 rounded-lg text-xs font-bold font-mono ${v>0?"bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300":"bg-gray-100 text-gray-400 dark:bg-gray-800"}">
              ${v>0?v+" L\xF4":"0 L\xF4"}
            </button>
          </div>

          <div class="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/60 text-xs border border-gray-100 dark:border-gray-800">
            <div>
              <span class="text-xs text-emerald-700 dark:text-emerald-400 block font-semibold">\u0110\xE3 Nh\u1EADp Kho</span>
              <span class="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">${L(w,1)}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">T\u1ED3n S\u1ED5 S\xE1ch</span>
              <span class="font-mono font-bold tabular-nums ${x<0?"text-rose-600":"text-gray-900 dark:text-white"}">${L(x,1)}</span>
            </div>
            <div>
              <span class="text-xs text-gray-500 block">Gi\xE1 Tr\u1ECB T\u1ED3n</span>
              <span class="font-mono font-bold text-amber-600 dark:text-amber-400 tabular-nums text-xs">${H(Number(h.total_value)||0)}</span>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-1">
            <button onclick="openWhItemHistoryModal('${h.sku}')" class="w-full py-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-bold rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="history" class="w-3.5 h-3.5"></i> Th\u1EBB Kho Xu\u1EA5t Nh\u1EADp
            </button>
            <button onclick="openWhItemBatchesModal('${h.sku}')" class="w-full py-2 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold rounded-xl border border-purple-200 dark:border-purple-800/60 flex items-center justify-center gap-1.5 transition-all">
              <i data-lucide="layers" class="w-3.5 h-3.5"></i> Chi Ti\u1EBFt L\xF4 H\xE0ng
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}async function Ae(){let t=document.getElementById("whInvSiteSelect"),n=localStorage.getItem("orbit_user_site"),o=document.getElementById("globalBranchSelect")?.value,e=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,a=n||o||e||(t?t.value:null)||"K001";if((a==="ALL"||a==="all")&&(a="K001"),a=a.toUpperCase(),t){if(!t.options||t.options.length<=1){let d=typeof window.getAppSitesList=="function"?window.getAppSitesList():[];t.innerHTML=d.map(c=>`<option value="${c.code}">${c.ten||c.name}</option>`).join("")}t.value=a}let i=document.getElementById("whInvCurrentSiteBadge");if(i){let c=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(u=>u.code&&u.code.toUpperCase()===a.toUpperCase());i.textContent=c?c.ten||c.name:a}let r=a,s=document.getElementById("whInventoryTableBody"),l=document.getElementById("whInventoryMobileCards");s&&(s.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u t\u1ED3n kho WMS...</td></tr>'),l&&(l.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\u1EA3i d\u1EEF li\u1EC7u t\u1ED3n kho WMS...</div>');try{let c=await(await fetch(`/api/wh/inventory?site=${encodeURIComponent(r)}&nocache=1`)).json();if(c.success){O=c.data||[],typeof window<"u"&&(window.gWhInventoryData=O);let u=document.getElementById("whInvCategorySelect");if(u){let g=u.value,b=Array.from(new Set(O.map(y=>y.category).filter(Boolean))).sort();u.innerHTML='<option value="">T\u1EA5t c\u1EA3 nh\xF3m ng\xE0nh</option>'+b.map(y=>`<option value="${y}">${y}</option>`).join(""),g&&b.includes(g)&&(u.value=g)}Re()}else s&&(s.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500">L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u: ${c.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</td></tr>`)}catch(d){console.error("loadWhInventory error:",d),s&&(s.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${d.message}</td></tr>`)}}var Y=null,Ct=null;function Xs(){return Y}function Ks(){return Ct}async function Fo(t){let n=(O||[]).find(u=>u.sku===t)||{sku:t,name:t,unit:"Ph\u1EA7n"},o=document.getElementById("whInvSiteSelect"),e=o?o.value:"ALL",a=document.getElementById("histItemSku");a&&(a.textContent=n.sku);let i=document.getElementById("histItemName");i&&(i.textContent=n.name||n.sku);let r=document.getElementById("histItemUnit");r&&(r.textContent=n.unit||"Ph\u1EA7n");let s=document.getElementById("histItemSite");s&&(s.textContent=e==="ALL"?"To\xE0n H\u1EC7 Th\u1ED1ng":e);let l=document.getElementById("modalWhItemHistory");l&&l.classList.remove("hidden");let d=document.getElementById("whHistTableBody"),c=document.getElementById("whHistMobileCards");d&&(d.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">\u0110ang truy xu\u1EA5t th\u1EBB kho t\u1EEB h\u1EC7 th\u1ED1ng...</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">\u0110ang truy xu\u1EA5t th\u1EBB kho...</div>');try{let g=await(await fetch(`/api/wh/item-history?sku=${encodeURIComponent(t)}&site=${encodeURIComponent(e)}&nocache=1`)).json();if(g.success){Y=g.data,typeof window<"u"&&(window.gWhActiveHistory=Y);let b=g.data.history||[],y=document.getElementById("histTotalIn");y&&(y.textContent=L(g.data.total_in||0,1));let p=document.getElementById("histTotalOut");p&&(p.textContent=L(g.data.total_out||0,1));let h=document.getElementById("histRowCount");if(h&&(h.textContent=L(b.length,0)),!b.length){d&&(d.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Ch\u01B0a ghi nh\u1EADn giao d\u1ECBch xu\u1EA5t nh\u1EADp n\xE0o cho m\xE3 h\xE0ng n\xE0y t\u1EA1i \u0111i\u1EC3m \u0111\xE3 ch\u1ECDn.</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Ch\u01B0a ghi nh\u1EADn giao d\u1ECBch xu\u1EA5t nh\u1EADp n\xE0o.</div>');return}d&&(d.innerHTML=b.map(m=>{let w=parseFloat(String(m.qty_in||0)),x=parseFloat(String(m.qty_out||0)),v="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";return m.trans_type==="NHAP_KHO"?v="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200":m.trans_type==="XUAT_HUY"?v="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200":m.trans_type==="DIEU_CHUYEN"?v="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200":m.trans_type==="XUAT_KHO"&&(v="bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200"),`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="p-2.5 text-center whitespace-nowrap font-mono tabular-nums text-gray-600 dark:text-gray-300">${m.doc_date?String(m.doc_date).split("T")[0]:"\u2014"}</td>
              <td class="p-2.5 whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white">${m.doc_no||"\u2014"}</td>
              <td class="p-2.5 whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${v}">${m.trans_name||m.trans_type}</span>
              </td>
              <td class="p-2.5 whitespace-nowrap font-mono text-xs text-gray-600 dark:text-gray-300">
                ${m.batch_code?`<b class="text-purple-600 dark:text-purple-400">${m.batch_code}</b>`:"\u2014"}
                ${m.exp_date?`<span class="text-gray-400 block text-xs">HSD: ${String(m.exp_date).split("T")[0]}</span>`:""}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                ${w>0?`+${L(w,1)}`:"\u2014"}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                ${x>0?`-${L(x,1)}`:"\u2014"}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
                ${H(Number(m.unit_price)||0)}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-semibold text-gray-900 dark:text-white tabular-nums">
                ${H(Number(m.amount)||0)}
              </td>
              <td class="p-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300 max-w-[150px] truncate" title="${m.partner_name||""}">
                ${m.partner_name||"\u2014"}
              </td>
              <td class="p-2.5 text-gray-500 dark:text-gray-400 max-w-[200px] truncate" title="${m.notes||""}">
                ${m.notes||"\u2014"}
              </td>
            </tr>
          `}).join("")),c&&(c.innerHTML=b.map(m=>{let w=parseFloat(String(m.qty_in||0)),x=parseFloat(String(m.qty_out||0)),v=m.doc_date?String(m.doc_date).split("T")[0]:"\u2014";return`
            <div class="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <div class="font-mono font-bold text-gray-900 dark:text-white">${m.doc_no||"\u2014"}</div>
                <span class="text-xs text-gray-400 font-mono">${v}</span>
              </div>
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-700 dark:text-gray-300">${m.trans_name||m.trans_type}</span>
                <span class="font-mono font-bold ${w>0?"text-emerald-600":"text-rose-600"}">
                  ${w>0?`+${L(w,1)}`:`-${L(x,1)}`} ${n.unit||""}
                </span>
              </div>
              ${m.batch_code?`<div class="text-xs text-purple-600 dark:text-purple-400 font-mono">L\xF4: <b>${m.batch_code}</b> ${m.exp_date?"\u2022 HSD: "+String(m.exp_date).split("T")[0]:""}</div>`:""}
              ${m.partner_name?`<div class="text-xs text-gray-500">\u0110\u1ED1i t\xE1c: ${m.partner_name}</div>`:""}
              ${m.notes?`<div class="text-xs text-gray-400 italic">${m.notes}</div>`:""}
            </div>
          `}).join(""))}else d&&(d.innerHTML=`<tr><td colspan="10" class="p-8 text-center text-rose-500">L\u1ED7i: ${g.error}</td></tr>`)}catch(u){console.error("openWhItemHistoryModal error:",u),d&&(d.innerHTML=`<tr><td colspan="10" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${u.message}</td></tr>`)}}async function Do(t){let n=(O||[]).find(u=>u.sku===t)||{sku:t,name:t,unit:"Ph\u1EA7n"},o=document.getElementById("whInvSiteSelect"),e=o?o.value:"ALL",a=document.getElementById("batchItemSku");a&&(a.textContent=n.sku);let i=document.getElementById("batchItemName");i&&(i.textContent=n.name||n.sku);let r=document.getElementById("batchItemUnit");r&&(r.textContent=n.unit||"Ph\u1EA7n");let s=document.getElementById("batchItemSite");s&&(s.textContent=e==="ALL"?"To\xE0n H\u1EC7 Th\u1ED1ng":e);let l=document.getElementById("modalWhItemBatches");l&&l.classList.remove("hidden");let d=document.getElementById("whBatchesTableBody"),c=document.getElementById("whBatchesMobileCards");d&&(d.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400">\u0110ang truy v\u1EA5n danh s\xE1ch l\xF4 date FEFO...</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">\u0110ang truy v\u1EA5n l\xF4 date...</div>');try{let g=await(await fetch(`/api/wh/item-batches?sku=${encodeURIComponent(t)}&site=${encodeURIComponent(e)}&nocache=1`)).json();if(g.success){Ct=g.data,typeof window<"u"&&(window.gWhActiveBatches=Ct);let b=g.data.batches||[],y=0,p=0;b.forEach(x=>{x.status==="GOOD"?y++:p++});let h=document.getElementById("batchTotalCount");h&&(h.textContent=L(b.length,0));let m=document.getElementById("batchSafeCount");m&&(m.textContent=L(y,0));let w=document.getElementById("batchWarnCount");if(w&&(w.textContent=L(p,0)),!b.length){d&&(d.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400">Ch\u01B0a c\xF3 l\xF4 h\xE0ng date ri\xEAng bi\u1EC7t n\xE0o \u0111\u01B0\u1EE3c ghi nh\u1EADn cho m\xE3 n\xE0y (\u0111ang qu\u1EA3n l\xFD t\u1ED3n g\u1ED9p theo site).</td></tr>'),c&&(c.innerHTML='<div class="p-8 text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-xl">Ch\u01B0a c\xF3 l\xF4 h\xE0ng date ri\xEAng bi\u1EC7t.</div>');return}d&&(d.innerHTML=b.map(x=>{let v="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200",C="C\xF2n h\u1EA1n an to\xE0n";x.status==="EXPIRED"?(v="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200",C="\u0110\xE3 h\u1EBFt h\u1EA1n"):x.status==="NEAR_EXPIRY"&&(v="bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200",C="C\u1EADn date (\u2264 30 ng\xE0y)");let I=x.exp_date?String(x.exp_date).split("T")[0]:"\u2014",F=x.days_left!==999?`${x.days_left} ng\xE0y`:"\u2014";return`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="p-2.5 whitespace-nowrap font-mono font-bold text-purple-700 dark:text-purple-400">${x.batch_code||"L\xD4-CHUNG"}</td>
              <td class="p-2.5 whitespace-nowrap text-gray-700 dark:text-gray-300">
                <span>${x.site_code||""}</span> \u2022 <span class="text-gray-400">${x.storage_loc||"K\u1EC7 B\u1EBFp"}</span>
              </td>
              <td class="p-2.5 text-center whitespace-nowrap font-mono font-semibold text-gray-800 dark:text-gray-200 tabular-nums">${I}</td>
              <td class="p-2.5 text-center whitespace-nowrap font-mono tabular-nums font-semibold ${x.status==="EXPIRED"?"text-rose-600":x.status==="NEAR_EXPIRY"?"text-amber-600":"text-emerald-600"}">
                ${F}
              </td>
              <td class="p-2.5 text-center whitespace-nowrap">
                <span class="px-2 py-0.5 rounded-full text-xs font-bold ${v}">${C}</span>
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono text-gray-600 dark:text-gray-300 tabular-nums">
                ${L(Number(x.initial_qty)||0,1)}
              </td>
              <td class="p-2.5 text-right whitespace-nowrap font-mono font-bold text-blue-700 dark:text-blue-400 tabular-nums">
                ${L(Number(x.current_qty)||0,1)}
              </td>
              <td class="p-2.5 whitespace-nowrap font-mono text-gray-500 text-xs">
                ${x.receipt_code?`<span class="text-brand-600 font-semibold">${x.receipt_code}</span>`:"\u2014"}
              </td>
            </tr>
          `}).join("")),c&&(c.innerHTML=b.map(x=>{let v=x.exp_date?String(x.exp_date).split("T")[0]:"\u2014";return`
            <div class="bg-gray-50 dark:bg-gray-800/60 p-3 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2 text-xs">
              <div class="flex items-center justify-between">
                <span class="font-mono font-bold text-purple-700 dark:text-purple-400">L\xF4: ${x.batch_code||"L\xD4-CHUNG"}</span>
                <span class="font-mono font-semibold text-xs ${x.status==="EXPIRED"?"text-rose-600":x.status==="NEAR_EXPIRY"?"text-amber-600":"text-emerald-600"}">
                  ${x.days_left!==999?`C\xF2n ${x.days_left} ng\xE0y`:""}
                </span>
              </div>
              <div class="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                <div>H\u1EA1n d\xF9ng: <b class="font-mono text-gray-900 dark:text-white">${v}</b></div>
                <div>V\u1ECB tr\xED: <b class="text-gray-900 dark:text-white">${x.storage_loc||"K\u1EC7 B\u1EBFp"}</b></div>
                <div>SL Nh\u1EADp: <b class="font-mono text-gray-900 dark:text-white">${L(Number(x.initial_qty)||0,1)}</b></div>
                <div>SL T\u1ED3n: <b class="font-mono font-bold text-blue-600 dark:text-blue-400">${L(Number(x.current_qty)||0,1)}</b></div>
              </div>
              ${x.receipt_code?`<div class="text-xs text-gray-400">Ch\u1EE9ng t\u1EEB: ${x.receipt_code}</div>`:""}
            </div>
          `}).join(""))}else d&&(d.innerHTML=`<tr><td colspan="8" class="p-8 text-center text-rose-500">L\u1ED7i: ${g.error}</td></tr>`)}catch(u){console.error("openWhItemBatchesModal error:",u),d&&(d.innerHTML=`<tr><td colspan="8" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${u.message}</td></tr>`)}}var Z=[],tt=null;function zs(){return Z}function Ro(t){let n=document.getElementById("whInvTabBtnBalance"),o=document.getElementById("whInvTabBtnReceipts"),e=document.getElementById("whInvBalanceView"),a=document.getElementById("whInvReceiptsView");t==="balance"?(n&&(n.className="btn btn-primary btn-sm"),o&&(o.className="btn btn-secondary btn-sm"),e&&e.classList.remove("hidden"),a&&a.classList.add("hidden")):(n&&(n.className="btn btn-secondary btn-sm"),o&&(o.className="btn btn-primary btn-sm"),e&&e.classList.add("hidden"),a&&a.classList.remove("hidden"),Jt()),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Oe(){let t=document.getElementById("whReceivedOrdersSiteFilter");if(!t||t.options&&t.options.length>1)return;let n=typeof window.getAppSitesList=="function"?window.getAppSitesList():[];t.innerHTML=n.map(e=>`<option value="${e.code}">${e.ten||e.name}</option>`).join("");let o=localStorage.getItem("orbit_user_site")||(typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():"K001");o&&(t.value=o.toUpperCase())}function zt(){let t=document.getElementById("whReceivedOrdersTableBody"),n=document.getElementById("whReceivedOrdersMobileCards"),o=(document.getElementById("whReceivedOrdersSearchInput")?.value||"").trim().toLowerCase(),e=document.getElementById("whReceivedOrdersTypeFilter")?.value||"ALL",a=[...Z];e!=="ALL"&&(a=a.filter(u=>u.doc_type===e)),o&&(a=a.filter(u=>(u.po_number||"").toLowerCase().includes(o)||(u.receipt_code||"").toLowerCase().includes(o)||(u.supplier||"").toLowerCase().includes(o)||(u.site_code||"").toLowerCase().includes(o)||(u.notes||"").toLowerCase().includes(o)||(u.created_by||"").toLowerCase().includes(o)));let i=document.getElementById("whKpiReceivedOrdersCount"),r=document.getElementById("whKpiReceivedOrdersTotalQty"),s=document.getElementById("whKpiReceivedOrdersTotalAmount"),l=document.getElementById("whReceivedOrdersCountText"),d=0,c=0;if(a.forEach(u=>{d+=Number(u.total_qty)||0,c+=Number(u.total_amount)||0}),i&&(i.textContent=String(a.length)),r&&(r.textContent=L(d,1)),s&&(s.textContent=Math.round(c).toLocaleString("vi-VN")+" \u20AB"),l&&(l.textContent=String(a.length)),!a.length){t&&(t.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),n&&(n.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho n\xE0o kh\u1EDBp v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}t&&(t.innerHTML=a.map((u,g)=>{let y=u.doc_type==="DIRECT"?'<span class="badge badge-neutral text-xs">Tr\u1EF1c ti\u1EBFp</span>':u.doc_type==="PR"?'<span class="badge badge-brand text-xs">\u0110\u01A1n PR</span>':'<span class="badge badge-brand text-xs">\u0110\u01A1n PO</span>',p=U(u.receipt_date),h=Math.round(Number(u.total_amount)||0).toLocaleString("vi-VN")+" \u20AB";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="w-10 text-center text-gray-400 num font-mono text-xs">${g+1}</td>
          <td class="col-code font-bold">
            <span class="code font-bold text-brand-600 dark:text-brand-400">${f(u.po_number||"\u2014")}</span>
            <div class="mt-0.5">${y}</div>
          </td>
          <td class="col-code">
            <span class="code text-gray-800 dark:text-gray-200">${f(u.receipt_code||"\u2014")}</span>
          </td>
          <td class="text-center font-semibold text-xs text-gray-700 dark:text-gray-300">
            <span class="badge badge-neutral">${f(u.site_code||"K001")}</span>
          </td>
          <td class="col-date num whitespace-nowrap text-xs text-gray-600 dark:text-gray-300">${p}</td>
          <td>
            <div class="font-medium text-xs text-gray-900 dark:text-white">${f(u.supplier||"N/A")}</div>
            ${u.notes?`<div class="text-xs text-gray-400 truncate max-w-[200px]" title="${f(u.notes)}">${f(u.notes)}</div>`:""}
          </td>
          <td class="col-num text-center num text-xs font-semibold">${u.item_count||1} m\xF3n</td>
          <td class="col-num text-right font-bold text-gray-900 dark:text-white num text-xs">${h}</td>
          <td class="text-xs text-gray-500 dark:text-gray-400">${f(u.created_by||"Th\u1EE7 kho")}</td>
          <td class="col-badge text-center">
            <span class="badge badge-brand text-xs whitespace-nowrap">\u0110\xE3 nh\u1EADp kho</span>
          </td>
          <td class="col-actions text-center whitespace-nowrap">
            <div class="inline-flex items-center gap-1.5 justify-center">
              <button onclick="openWhReceivedOrderDetail('${u.id||""}', '${f(u.po_number||"")}')" class="btn btn-secondary btn-sm" title="Xem chi ti\u1EBFt d\xF2ng h\xE0ng">
                <i data-lucide="eye" class="w-3.5 h-3.5"></i> Chi ti\u1EBFt
              </button>
              <button onclick="confirmCancelReceivedOrder('${u.id||""}', '${f(u.po_number||"")}', '${f(u.receipt_code||"")}', ${Number(u.total_amount)||0})" class="btn btn-danger btn-sm" title="H\u1EE7y nh\u1EADp kho v\xE0 ho\xE0n t\xE1c t\u1ED3n kho">
                <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> H\u1EE7y nh\u1EADp
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=a.map(u=>{let b=u.doc_type==="DIRECT"?'<span class="badge badge-neutral text-xs">Tr\u1EF1c ti\u1EBFp</span>':u.doc_type==="PR"?'<span class="badge badge-brand text-xs">\u0110\u01A1n PR</span>':'<span class="badge badge-brand text-xs">\u0110\u01A1n PO</span>',y=U(u.receipt_date),p=Math.round(Number(u.total_amount)||0).toLocaleString("vi-VN")+" \u20AB";return`
        <div class="data-card">
          <div class="data-card-header">
            <div class="flex items-center gap-2">
              <span class="code font-bold text-brand-600 dark:text-brand-400">${f(u.po_number||u.receipt_code||"")}</span>
              ${b}
            </div>
            <span class="badge badge-brand text-xs">\u0110\xE3 nh\u1EADp kho</span>
          </div>

          <div class="data-card-body space-y-1.5">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">Phi\u1EBFu nh\u1EADp:</span>
              <span class="code text-gray-700 dark:text-gray-300 font-semibold">${f(u.receipt_code||"\u2014")}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">Nh\xE0 cung c\u1EA5p:</span>
              <span class="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">${f(u.supplier||"N/A")}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-400">\u0110i\u1EC3m nh\u1EADn / Ng\xE0y:</span>
              <span class="text-gray-600 dark:text-gray-300 font-medium">${f(u.site_code||"")} \u2022 <span class="num">${y}</span></span>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-gray-400 block">S\u1ED1 m\u1EB7t h\xE0ng</span>
                <span class="num font-bold text-gray-900 dark:text-white">${u.item_count||1} m\xF3n (${L(u.total_qty||0,1)})</span>
              </div>
              <div class="text-right">
                <span class="text-gray-400 block">T\u1ED5ng ti\u1EC1n nh\u1EADp</span>
                <span class="num font-bold text-brand-600 dark:text-brand-400 text-sm">${p}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 mt-2 border-t border-gray-100 dark:border-gray-800">
            <button onclick="openWhReceivedOrderDetail('${u.id||""}', '${f(u.po_number||"")}')" class="btn btn-secondary btn-sm w-full">
              <i data-lucide="eye" class="w-3.5 h-3.5"></i> Xem chi ti\u1EBFt
            </button>
            <button onclick="confirmCancelReceivedOrder('${u.id||""}', '${f(u.po_number||"")}', '${f(u.receipt_code||"")}', ${Number(u.total_amount)||0})" class="btn btn-danger btn-sm w-full">
              <i data-lucide="rotate-ccw" class="w-3.5 h-3.5"></i> H\u1EE7y nh\u1EADp kho
            </button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Ao(){zt()}async function Jt(){Oe();let t=document.getElementById("whReceivedOrdersSiteFilter"),n=localStorage.getItem("orbit_user_site"),o=document.getElementById("globalBranchSelect")?.value,e=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,a=n||o||e||(t?t.value:null)||"K001";(a==="ALL"||a==="all")&&(a="K001"),a=a.toUpperCase(),t&&(t.value=a);let i=a,r=document.getElementById("whReceivedOrdersTableBody"),s=document.getElementById("whReceivedOrdersMobileCards");r&&(r.innerHTML='<tr><td colspan="11" class="p-8 text-center text-gray-400">\u0110ang t\u1EA3i danh s\xE1ch \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho...</td></tr>'),s&&(s.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\u1EA3i danh s\xE1ch \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho...</div>');try{let d=await(await fetch(`/api/wh/received-orders?site=${encodeURIComponent(i)}&no-cache=1`)).json();d.success&&d.data?Z=d.data.orders||[]:Z=[],typeof window<"u"&&(window.gWhReceivedOrders=Z);let c=document.getElementById("whInvBadgeReceiptsCount");c&&(c.textContent=String(Z.length)),zt()}catch(l){console.error("loadWhReceivedOrders error:",l),r&&(r.innerHTML=`<tr><td colspan="11" class="p-8 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i danh s\xE1ch: ${l.message}</td></tr>`),s&&(s.innerHTML=`<div class="p-6 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i danh s\xE1ch: ${l.message}</div>`)}}async function Oo(t,n){let o=document.getElementById("whReceivedOrderDetailModal");if(!o)return;o.classList.remove("hidden");let e=document.getElementById("whRecModalTitle"),a=document.getElementById("whRecModalPoNumber"),i=document.getElementById("whRecModalReceiptCode"),r=document.getElementById("whRecModalSite"),s=document.getElementById("whRecModalDate"),l=document.getElementById("whRecModalSupplier"),d=document.getElementById("whRecModalCreatedBy"),c=document.getElementById("whRecModalTotalAmount"),u=document.getElementById("whRecModalLinesBody");e&&(e.textContent=`Chi ti\u1EBFt \u0111\u01A1n h\xE0ng \u0111\xE3 nh\u1EADp kho: ${n||t}`),a&&(a.textContent=n||"\u2014"),u&&(u.innerHTML='<tr><td colspan="9" class="p-6 text-center text-gray-400">\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng \u0111\xE3 nh\u1EADp...</td></tr>'),tt={receiptId:t,poNumber:n},typeof window<"u"&&(window.gWhCurrentReceivedDetail=tt);try{let g=(Z||[]).find(y=>t&&String(y.id)===String(t)||n&&y.po_number===n);g&&(i&&(i.textContent=g.receipt_code||"\u2014"),r&&(r.textContent=g.site_code||"\u2014"),s&&(s.textContent=U(g.receipt_date)),l&&(l.textContent=g.supplier||"\u2014"),d&&(d.textContent=g.created_by||"Th\u1EE7 kho"),c&&(c.textContent=Math.round(Number(g.total_amount)||0).toLocaleString("vi-VN")+" \u20AB"),tt.receiptCode=g.receipt_code,tt.totalAmount=g.total_amount);let b=[];if(t){let p=await(await fetch(`/api/fnb/receipts?id=${encodeURIComponent(t)}`)).json();p.success&&p.data&&(b=p.data.lines||[])}else if(n){let p=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(n)}`)).json();p.success&&p.data&&(b=(p.data||[]).map(h=>({item_code:h.article,item_name:h.article_desc||h.article,unit:h.order_unit||"Ph\u1EA7n",qty:h.received_qty||h.order_qty,unit_price:h.net_price,amount:(h.received_qty||h.order_qty)*h.net_price,batch_code:h.batch_code||"L\xD4-SAP",exp_date:h.exp_date||null})))}if(!b.length){u&&(u.innerHTML='<tr><td colspan="9" class="p-6 text-center text-gray-400">Kh\xF4ng c\xF3 d\xF2ng h\xE0ng n\xE0o \u0111\u01B0\u1EE3c ghi nh\u1EADn cho phi\u1EBFu n\xE0y.</td></tr>');return}u&&(u.innerHTML=b.map((y,p)=>{let h=Number(y.qty)||0,m=Number(y.unit_price)||0,w=Number(y.amount)||h*m,x=y.exp_date?U(y.exp_date.slice(0,10)):"\u2014";return`
          <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/20">
            <td class="text-center num text-xs font-mono text-gray-400">${p+1}</td>
            <td class="col-code font-bold text-xs">${f(y.item_code)}</td>
            <td class="font-medium text-xs text-gray-900 dark:text-white">${f(y.item_name||y.item_code)}</td>
            <td class="text-center text-xs font-semibold text-gray-600 dark:text-gray-300">${f(y.unit||"Ph\u1EA7n")}</td>
            <td class="col-num text-right num font-bold text-emerald-600 dark:text-emerald-400 text-xs">${L(h,1)}</td>
            <td class="col-num text-right num text-xs">${Math.round(m).toLocaleString("vi-VN")} \u20AB</td>
            <td class="col-num text-right num font-semibold text-gray-900 dark:text-white text-xs">${Math.round(w).toLocaleString("vi-VN")} \u20AB</td>
            <td class="text-center font-mono text-xs text-gray-700 dark:text-gray-300">${f(y.batch_code||"\u2014")}</td>
            <td class="col-date text-center num text-xs text-gray-600 dark:text-gray-400">${x}</td>
          </tr>
        `}).join(""))}catch(g){console.error("Error openWhReceivedOrderDetail:",g),u&&(u.innerHTML=`<tr><td colspan="9" class="p-6 text-center text-rose-500 font-medium">L\u1ED7i t\u1EA3i chi ti\u1EBFt: ${g.message}</td></tr>`)}typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function We(){let t=document.getElementById("whReceivedOrderDetailModal");t&&t.classList.add("hidden"),tt=null,typeof window<"u"&&(window.gWhCurrentReceivedDetail=null)}function Wo(){if(!tt)return;let{receiptId:t,poNumber:n,receiptCode:o,totalAmount:e}=tt;Pe(t,n,o,e)}async function Pe(t,n,o,e){let a=o||n||"\u0111\u01A1n h\xE0ng n\xE0y",i=e?Math.round(e).toLocaleString("vi-VN")+" \u20AB":"",r=`B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n H\u1EE6Y NH\u1EACP KHO cho \u0111\u01A1n h\xE0ng [${a}]`+(i?` v\u1EDBi gi\xE1 tr\u1ECB ${i}`:"")+`?

\u2022 To\xE0n b\u1ED9 s\u1ED1 l\u01B0\u1EE3ng nh\u1EADp kho s\u1EBD \u0111\u01B0\u1EE3c HO\xC0N T\xC1C TR\u1EEA KH\u1ECEI T\u1ED2N KHO th\u1EF1c t\u1EBF.
\u2022 \u0110\u01A1n h\xE0ng PO/PR s\u1EBD \u0111\u01B0\u1EE3c m\u1EDF l\u1EA1i (tr\u1EA1ng th\xE1i Ch\u1EDD nh\u1EADp) \u0111\u1EC3 c\xF3 th\u1EC3 nh\u1EADp l\u1EA1i khi c\u1EA7n.`;if(confirm(r))try{typeof showLoading=="function"&&showLoading("\u0110ang h\u1EE7y nh\u1EADp kho v\xE0 ho\xE0n t\xE1c t\u1ED3n kho...");let l=await(await fetch("/api/fnb/receipts/cancel",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:t||void 0,po_number:n||void 0})})).json();l.success?(typeof showToast=="function"&&showToast(l.message||"H\u1EE7y nh\u1EADp kho th\xE0nh c\xF4ng!","success"),We(),Jt()):typeof showToast=="function"&&showToast(`L\u1ED7i h\u1EE7y nh\u1EADp kho: ${l.error}`,"error")}catch(s){console.error("confirmCancelReceivedOrder error:",s),typeof showToast=="function"&&showToast(`L\u1ED7i k\u1EBFt n\u1ED1i: ${s.message}`,"error")}finally{typeof hideLoading=="function"&&hideLoading()}}function Po(){let t=at&&at.length?at:O;if(!t||!t.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let n=document.getElementById("whInvSiteSelect")?.value||"ALL",e=[["STT","M\xE3 SKU","T\xEAn M\u1EB7t H\xE0ng","Nh\xF3m Ng\xE0nh H\xE0ng","\u0110\u01A1n V\u1ECB T\xEDnh","S\u1ED1 L\u01B0\u1EE3ng \u0110\xE3 Nh\u1EADp","S\u1ED1 L\u01B0\u1EE3ng T\u1ED3n S\u1ED5 S\xE1ch","\u0110\u01A1n Gi\xE1 Chu\u1EA9n (VN\u0110)","T\u1ED5ng Gi\xE1 Tr\u1ECB T\u1ED3n (VN\u0110)","S\u1ED1 L\xF4 Qu\u1EA3n L\xFD","Ng\xE0y Nh\u1EADp G\u1EA7n Nh\u1EA5t","Ng\xE0y Ki\u1EC3m K\xEA G\u1EA7n Nh\u1EA5t"]];t.forEach((d,c)=>{e.push([c+1,d.sku||"",d.name||"",d.category||"",d.unit||"",parseFloat(String(d.receipt_qty||0)),parseFloat(String(d.book_qty||0)),parseFloat(String(d.unit_price||0)),parseFloat(String(d.total_value||0)),parseInt(String(d.batch_count||0),10),d.last_receipt_date?String(d.last_receipt_date).split("T")[0]:"",d.last_count_date?String(d.last_count_date).split("T")[0]:""])});let a=XLSX.utils.book_new(),i=XLSX.utils.aoa_to_sheet(e),r=XLSX.utils.decode_range(i["!ref"]);i["!cols"]=[{wch:6},{wch:14},{wch:34},{wch:18},{wch:10},{wch:16},{wch:18},{wch:18},{wch:20},{wch:14},{wch:16},{wch:18}];for(let d=r.s.r;d<=r.e.r;++d)for(let c=r.s.c;c<=r.e.c;++c){let u=XLSX.utils.encode_cell({r:d,c});if(i[u])if(d===0)i[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let g="left",b;c===0||c===1||c===4||c===9||c===10||c===11?g="center":c===5||c===6?(g="right",b="#,##0.0"):(c===7||c===8)&&(g="right",b="#,##0");let y=c===6&&typeof i[u].v=="number"&&i[u].v<0;i[u].s={font:{name:"Aptos",sz:11,bold:c===6||c===8,color:{rgb:y?"C00000":"000000"}},alignment:{horizontal:g,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},b&&(i[u].z=b)}}i["!freeze"]={xSplit:0,ySplit:1},i["!autofilter"]={ref:i["!ref"]};let s=new Date().toISOString().slice(0,10).replace(/-/g,""),l=`Ton_Kho_WMS_${n}_${s}.xlsx`;XLSX.utils.book_append_sheet(a,i,"TonKhoWMS"),XLSX.writeFile(a,l),typeof showToast=="function"&&showToast(`\u0110\xE3 xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho ${n} th\xE0nh c\xF4ng!`,"success")}function jo(){if(!Y||!Y.history){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u th\u1EBB kho \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let t=Y,n=t.history||[];if(!n.length){typeof showToast=="function"&&showToast("Kh\xF4ng c\xF3 ph\xE1t sinh giao d\u1ECBch n\xE0o \u0111\u1EC3 xu\u1EA5t Excel!","error");return}let e=[["STT","Ng\xE0y Ch\u1EE9ng T\u1EEB","S\u1ED1 Ch\u1EE9ng T\u1EEB","Lo\u1EA1i Nghi\u1EC7p V\u1EE5","M\xE3 L\xF4","H\u1EA1n D\xF9ng (HSD)","S\u1ED1 L\u01B0\u1EE3ng Nh\u1EADp (+)","S\u1ED1 L\u01B0\u1EE3ng Xu\u1EA5t (-)","\u0110\u01A1n Gi\xE1 (VN\u0110)","Th\xE0nh Ti\u1EC1n (VN\u0110)","\u0110\u1ED1i T\xE1c / Nh\xE0 Cung C\u1EA5p","Ghi Ch\xFA / Di\u1EC5n Gi\u1EA3i"]];n.forEach((d,c)=>{e.push([c+1,d.doc_date?String(d.doc_date).split("T")[0]:"",d.doc_no||"",d.trans_name||d.trans_type||"",d.batch_code||"",d.exp_date?String(d.exp_date).split("T")[0]:"",parseFloat(String(d.qty_in||0)),parseFloat(String(d.qty_out||0)),parseFloat(String(d.unit_price||0)),parseFloat(String(d.amount||0)),d.partner_name||"",d.notes||""])});let a=XLSX.utils.book_new(),i=XLSX.utils.aoa_to_sheet(e),r=XLSX.utils.decode_range(i["!ref"]);i["!cols"]=[{wch:6},{wch:14},{wch:16},{wch:16},{wch:14},{wch:14},{wch:16},{wch:16},{wch:16},{wch:18},{wch:28},{wch:30}];for(let d=r.s.r;d<=r.e.r;++d)for(let c=r.s.c;c<=r.e.c;++c){let u=XLSX.utils.encode_cell({r:d,c});if(i[u])if(d===0)i[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let g="left",b;c===0||c===1||c===2||c===3||c===4||c===5?g="center":c===6||c===7?(g="right",b="#,##0.0"):(c===8||c===9)&&(g="right",b="#,##0"),i[u].s={font:{name:"Aptos",sz:11,bold:c===6||c===7,color:{rgb:"000000"}},alignment:{horizontal:g,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},b&&(i[u].z=b)}}i["!freeze"]={xSplit:0,ySplit:1},i["!autofilter"]={ref:i["!ref"]};let s=new Date().toISOString().slice(0,10).replace(/-/g,""),l=`The_Kho_${t.sku}_${t.site}_${s}.xlsx`;XLSX.utils.book_append_sheet(a,i,"TheKho"),XLSX.writeFile(a,l),typeof showToast=="function"&&showToast(`\u0110\xE3 xu\u1EA5t th\u1EBB kho m\xE3 ${t.sku} th\xE0nh c\xF4ng!`,"success")}if(typeof window<"u"){let t=window;t.gWhInventoryData=O,t.gWhFilteredInventory=at,t.gWhActiveHistory=Y,t.gWhActiveBatches=Ct,t.gWhReceivedOrders=Z,t.gWhCurrentReceivedDetail=tt,t.loadWhInventory=Ae,t.loadPoSap=Ae,t.filterWhInventoryTable=Re,t.openWhItemHistoryModal=Fo,t.openWhItemBatchesModal=Do,t.switchWhInvSubView=Ro,t.populateWhReceivedOrdersSiteFilter=Oe,t.loadWhReceivedOrders=Jt,t.filterWhReceivedOrdersTable=Ao,t.renderWhReceivedOrdersTable=zt,t.openWhReceivedOrderDetail=Oo,t.closeWhReceivedOrderDetailModal=We,t.onWhRecModalCancelClick=Wo,t.confirmCancelReceivedOrder=Pe,t.exportWhInventoryToExcel=Po,t.exportWhItemHistoryToExcel=jo}console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{jt as STANDARD_STEPS,oo as addEditOrderItemLine,an as addManualReceiptItem,Ht as addWasteLineRow,ea as api,xt as calcBudget,Ot as canAuthenticateJourney,J as canDeleteOrders,z as canEditOrders,fo as changeStockPage,wo as clearStockSelection,ie as closeConfirmClearManualLinesModal,oe as closeCreateReceiptModal,ue as closeCreateWasteModal,qt as closeDeleteOrderModal,Ee as closeEditOrderModal,Rn as closeInvDetailModal,ae as closeManualReceiptModal,St as closeModal,Yn as closeOrderJourneyModal,We as closeWhReceivedOrderDetailModal,Pe as confirmCancelReceivedOrder,se as confirmClearAllManualReceiptLines,ro as confirmDeleteOrder,zn as currentJourneyData,Qn as currentJourneyOrderCode,Zo as debounce,Ho as downloadRopExcel,B as editOrderItems,f as escapeHtml,pn as executeClearAllManualReceiptLines,so as executeDeleteOrder,An as exportCountSheetExcel,_o as exportFefoToExcel,Dt as exportFnbStockExcel,Mo as exportSelectedStockExcel,Po as exportWhInventoryToExcel,jo as exportWhItemHistoryToExcel,ot as filterFefoLive,Se as filterHsOrders,jn as filterItems,He as filterLeadTimeSla,st as filterManualCatalogList,Re as filterWhInventoryTable,Ao as filterWhReceivedOrdersTable,wt as formatBatchCode,Zt as formatCompactVND,U as formatDate,Yo as formatDateYMD,Me as formatItemQty,L as formatNumber,et as formatReceiptDateYMD,vt as formatUnit,H as formatVND,V as gFnbStockData,$ as gFnbStockFilter,Rt as gFnbStockSearchTerm,Ct as gWhActiveBatches,Y as gWhActiveHistory,tt as gWhCurrentReceivedDetail,at as gWhFilteredInventory,O as gWhInventoryData,Z as gWhReceivedOrders,X as getActiveFnbCountSite,W as getActiveFnbReceiptSite,P as getActiveFnbWasteSite,K as getAppItems,Ie as getDangerBadgeClass,co as getDaysRemainingMobileText,lo as getDaysRemainingText,_e as getDaysTextColor,io as getExpBadgeClass,uo as getExpDateColor,R as getReceiptExpWarningHtml,po as getSelectedStockSkus,go as getStockCurrentPage,Ks as getWhActiveBatches,Xs as getWhActiveHistory,js as getWhFilteredInventory,Ps as getWhInventoryData,zs as getWhReceivedOrders,xr as handleExportFnbStockExcel,No as loadDashboardSummary,Uo as loadFnbCounts,me as loadFnbCountsHistory,nt as loadFnbPoList,qe as loadFnbReceipts,Ze as loadFnbReceiptsHistory,fe as loadFnbStock,qo as loadFnbWaste,le as loadFnbWasteHistory,Kn as loadHistory,Bo as loadLeadTime,ht as loadManualCatalogItems,we as loadQuota,$o as loadReorderROP,Gt as loadStockFEFO,Bt as loadWasteModalItems,Ae as loadWhInventory,Jt as loadWhReceivedOrders,Hn as onCountInputChange,Nn as onCountNoteChange,Mn as onFnbCountDateChange,In as onFnbCountFilterChange,Tn as onFnbCountNganhHangChange,_n as onFnbCountSearch,$n as onFnbCountSiteChange,Ue as onFnbPoSearchInput,On as onFnbStockFilterChange,Wn as onFnbStockSearch,Pn as onFnbStockToggleValue,hn as onFnbWasteFilterChange,fn as onFnbWasteNganhHangChange,bn as onFnbWasteSearch,yn as onFnbWasteSiteChange,dn as onManualLineBatchChange,ln as onManualLineExpChange,un as onManualLineLocChange,sn as onManualLinePriceChange,rn as onManualLineQtyChange,nn as onManualReceiptSiteChange,Vn as onQtyChange,Ke as onReceiptLineBatchChange,Ge as onReceiptLineExpChange,ze as onReceiptLineNoteChange,Xe as onReceiptLineQtyChange,vn as onWasteLineNoteChange,xn as onWasteLineQtyChange,wn as onWasteLineReasonChange,Cn as onWasteModalItemSelect,pe as onWasteModalLineQtyInput,Sn as onWasteModalSiteChange,Wo as onWhRecModalCancelClick,Je as openCreateReceiptModal,Ln as openCreateWasteModal,Co as openEditItemModal,to as openEditOrderModal,ko as openIssueModal,To as openItemDetailModal,en as openManualReceiptModal,Jn as openOrderJourneyModal,ee as openPoReceiptModal,vo as openReceiptModal,Do as openWhItemBatchesModal,Fo as openWhItemHistoryModal,Oo as openWhReceivedOrderDetail,mt as parseQty,Ce as pendingDeleteOrderCode,Nt as populateFnbCountFilters,Ft as populateFnbCountNhomHangDropdown,ce as populateFnbWasteFilters,Mt as populateFnbWasteNhomHangDropdown,de as populateFnbWasteSiteDropdown,Oe as populateWhReceivedOrdersSiteFilter,Te as recalcEditOrderTotals,ge as recalculateWasteModalTotal,no as removeEditOrderItemLine,re as removeManualReceiptLine,gt as renderEditOrderItems,$e as renderFefoRows,j as renderFnbCountsTable,It as renderFnbPoTable,bt as renderFnbStock,ut as renderFnbWasteStockTable,Pt as renderHsOrdersList,Wt as renderJourneyBadge,Vt as renderJourneyTimeline,Qt as renderLeadTimeTable,lt as renderManualReceiptLinesTable,yt as renderOrderTable,ne as renderReceiptLinesTable,Be as renderRopTable,Fe as renderStockAlertsTable,zt as renderWhReceivedOrdersTable,bo as resetFefoFilters,qn as reviewOrder,ao as saveEditOrder,Fn as saveFnbCountAudit,Eo as saveItemSpecs,N as selectedStockSkus,At as setAppItems,cn as setManualLineQuickExp,Qe as setReceiptLineQuickExp,mo as setStockCurrentPage,ho as sortStockBy,Ye as submitCreateReceipt,En as submitCreateWaste,kn as submitDirectWaste,So as submitIssueToBackend,Zn as submitJourneyStep,gn as submitManualReceipt,Un as submitOrder,Lo as submitReceiptToBackend,dt as switchFnbReceiptSubView,ct as switchFnbWasteSubView,Ro as switchWhInvSubView,Bn as toggleBlindCount,on as toggleManualShowAllCatalog,yo as toggleSelectAllStock,xo as toggleStockItemSelect,Ne as updateApexChartsTheme,eo as updateEditOrderItemQty,_t as updateManualTotals,Lt as updateStockBulkBar,De as updateTailadminDashboard,$t as updateWasteKPIs,Dn as viewCountDetail,Gn as viewOrderDetail,tn as viewReceiptDetail,mn as viewWasteDetail};
