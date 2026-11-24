function et(t){return t==null||isNaN(t)?"0 \u20AB":Math.round(t).toLocaleString("vi-VN")+" \u20AB"}function qt(t){if(t==null||isNaN(t))return{val:"\u2014",unit:"",full:"\u2014"};let n=Number(t),o=Math.abs(n),e=n<0?"-":"",a=n.toLocaleString("vi-VN")+" \u20AB";if(o>=1e9){let i=(o/1e9).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:2});return{val:e+i,unit:"t\u1EF7 \u20AB",full:a}}else if(o>=1e6){let i=(o/1e6).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:1});return{val:e+i,unit:"tr \u20AB",full:a}}else return{val:e+o.toLocaleString("vi-VN"),unit:"\u20AB",full:a}}function To(t){if(!t)return"\u2014";if(typeof t=="string"&&/^\d{4}-\d{2}-\d{2}$/.test(t.trim()))return t.trim();try{let n=new Date(t);if(isNaN(n.getTime()))return String(t);let o=n.getFullYear(),e=String(n.getMonth()+1).padStart(2,"0"),a=String(n.getDate()).padStart(2,"0");return`${o}-${e}-${a}`}catch{return String(t)}}function Te(t){if(!t)return"\u2014";try{let n=new Date(t);if(isNaN(n.getTime()))return String(t);let o=String(n.getDate()).padStart(2,"0"),e=String(n.getMonth()+1).padStart(2,"0"),a=n.getFullYear();return`${o}/${e}/${a}`}catch{return String(t)}}function B(t,n=1){return t==null||isNaN(t)?"0":Number(t).toLocaleString("vi-VN",{minimumFractionDigits:0,maximumFractionDigits:n})}function g(t){return t?String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"):""}function Io(t,n=200){let o=null;return function(...e){o&&clearTimeout(o),o=setTimeout(()=>{t.apply(this,e)},n)}}var Ut=class{cache=new Map;defaultTtl=3e4;async get(n,o=this.defaultTtl){let e=Date.now(),a=this.cache.get(n);if(a&&e-a.timestamp<o)return e-a.timestamp>1e4&&fetch(n).then(i=>i.json()).then(i=>{i.success&&this.cache.set(n,{timestamp:Date.now(),data:i})}).catch(()=>{}),a.data;try{let r=await(await fetch(n)).json();return r.success&&this.cache.set(n,{timestamp:e,data:r}),r}catch(i){return{success:!1,error:i instanceof Error?i.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}async post(n,o){this.cache.clear();try{return await(await fetch(n,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(o)})).json()}catch(e){return{success:!1,error:e instanceof Error?e.message:"L\u1ED7i k\u1EBFt n\u1ED1i m\xE1y ch\u1EE7"}}}invalidate(n){if(!n){this.cache.clear();return}for(let o of this.cache.keys())o.includes(n)&&this.cache.delete(o)}async getPoList(n,o="OPEN"){return this.get(`/api/fnb/po-list?site_code=${encodeURIComponent(n)}&status=${encodeURIComponent(o)}`)}async getPoDetails(n){return this.get(`/api/fnb/po-details?po_number=${encodeURIComponent(n)}`)}async getReceiptHistory(n){return this.get(`/api/fnb/receipts-history?site_code=${encodeURIComponent(n)}`)}async getInventory(n){return this.get(`/api/wh/inventory?site=${encodeURIComponent(n)}`)}async submitManualReceipt(n){return this.post("/api/fnb/manual-receipt",n)}},$o=new Ut;function A(){let t=localStorage.getItem("orbit_user_site");if(t)return t.toUpperCase();let n=window,o=typeof n.App<"u"&&n.App.currentBranch?n.App.currentBranch.toUpperCase():"K001";return o==="ALL"||!o?"K001":o}function Q(t){if(!t||t==="\u2014")return"\u2014";let n=String(t).trim(),o=n.match(/^(\d{4})-(\d{2})-(\d{2})/);if(o)return`${o[1]}-${o[2]}-${o[3]}`;try{let e=new Date(n);if(!isNaN(e.getTime())){let a=e.getFullYear(),i=String(e.getMonth()+1).padStart(2,"0"),r=String(e.getDate()).padStart(2,"0");return`${a}-${i}-${r}`}}catch{}return n.slice(0,10)}function F(t){if(!t)return'<span class="text-gray-400 text-xs italic">Ch\u01B0a \u0111\u1EB7t EXP</span>';let n=new Date;n.setHours(0,0,0,0);let o=new Date(t);o.setHours(0,0,0,0);let e=Math.ceil((o.getTime()-n.getTime())/(1e3*60*60*24));return e<0?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-octagon" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n (${Math.abs(e)} ng\xE0y)</span>`:e===0?'<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> H\u1EBFt h\u1EA1n h\xF4m nay</span>':e<=7?`<span class="inline-flex items-center gap-1 font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="alert-triangle" class="w-3 h-3"></i> C\u1EADn date (${e} ng\xE0y)</span>`:e<=30?`<span class="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded text-xs"><i data-lucide="clock" class="w-3 h-3"></i> C\xF2n ${e} ng\xE0y</span>`:`<span class="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium text-xs"><i data-lucide="check-circle-2" class="w-3 h-3"></i> C\xF2n ${e} ng\xE0y</span>`}function nt(t){window.gFnbReceiptCurrentView=t;let n=document.getElementById("fnbReceiptTabBtnPo"),o=document.getElementById("fnbReceiptTabBtnHistory"),e=document.getElementById("fnbPoListView"),a=document.getElementById("fnbReceiptHistoryView");t==="po"?(n&&(n.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),e&&e.classList.remove("hidden"),a&&a.classList.add("hidden"),J()):(o&&(o.className="px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 bg-brand-500 text-white shadow-theme-xs"),n&&(n.className="px-4 py-2 rounded-xl text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all flex items-center gap-2 border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3"),a&&a.classList.remove("hidden"),e&&e.classList.add("hidden"),typeof window.loadFnbReceiptsHistory=="function"&&window.loadFnbReceiptsHistory())}async function Ie(t){let n=t||A(),o=document.getElementById("fnbReceiptFilterSite");o&&(o.value=n);let a=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(s=>s.code.toUpperCase()===n.toUpperCase()),i=a?a.ten||a.name:n,r=document.getElementById("fnbReceiptCurrentSiteBadge");r&&(r.textContent=i),window.gFnbReceiptCurrentView==="history"?typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(n):await J(n)}function Me(t){vt(t)}async function J(t){let n=t||A(),o=document.getElementById("fnbPoStatusFilter"),e=o?o.value:"OPEN",a=document.getElementById("fnbPoSummaryText");try{a&&(a.textContent=`\u0110ang t\u1EA3i \u0111\u01A1n PO c\u1EE7a ${n}...`);let r=await(await fetch(`/api/fnb/po-list?site_code=${encodeURIComponent(n)}&status=${encodeURIComponent(e)}&no-cache=1`)).json();if(r.success&&r.data){window.gFnbPoList=r.data;let s=document.getElementById("fnbPoSearchInput")?.value||"";vt(s);let d=(window.gFnbPoList||[]).filter(u=>u.status==="OPEN").length,l=document.getElementById("fnbReceiptBadgePendingCount");l&&(l.textContent=String(d))}else throw new Error(r.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c danh s\xE1ch PO")}catch(i){console.error("loadFnbPoList error:",i),a&&(a.textContent="L\u1ED7i t\u1EA3i \u0111\u01A1n PO: "+i.message)}}function vt(t=""){let n=document.getElementById("fnbPoTableBody"),o=document.getElementById("fnbPoMobileCards"),e=document.getElementById("fnbPoSummaryText"),a=(document.getElementById("fnbPoSupplierFilter")?.value||"").toLowerCase(),i=(t||"").toLowerCase().trim(),r=window.gFnbPoList||[];a&&(r=r.filter(s=>{let d=(s.supplier_name||"").toLowerCase();return a==="siba"?d.includes("siba")||d.includes("b\u1EBFp trung t\xE2m")||d.includes("trung t\xE2m"):a==="baf"?d.includes("baf")||d.includes("th\u1ECBt"):a==="spice"?d.includes("gia v\u1ECB")||d.includes("\u0111\u01B0\u1EDDng")||d.includes("unilever")||d.includes("cholimex")||d.includes("mu\u1ED1i"):a==="veg"?d.includes("rau")||d.includes("\u0111\xE0 l\u1EA1t")||d.includes("c\u1EE7"):!0})),i&&(r=r.filter(s=>{let d=(s.po_number||"").toLowerCase(),l=(s.supplier_name||"").toLowerCase(),u=(s.supplier_code||"").toLowerCase();return d.includes(i)||l.includes(i)||u.includes(i)})),e&&(e.textContent=`Hi\u1EC3n th\u1ECB ${r.length} \u0111\u01A1n \u0111\u1EB7t h\xE0ng`),n&&(r.length===0?n.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o cho \u0111i\u1EC3m b\xE1n n\xE0y.</td></tr>':n.innerHTML=r.map(s=>{let d=s.status==="OPEN",l=s.status==="COMPLETED",u=l?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400"><i data-lucide="check-circle-2" class="w-3 h-3"></i> \u0110\xE3 Nh\u1EADp Kho</span>':d?'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400"><i data-lucide="clock" class="w-3 h-3"></i> Ch\u1EDD Nh\u1EADp Kho</span>':'<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">Nh\u1EADp 1 ph\u1EA7n</span>',m=(s.po_number||"").startsWith("50000")||!s.supplier_code||s.supplier_name==="B\u1EBFp Trung T\xE2m Siba"?'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300 mr-1.5">B\u1EBEP TRUNG T\xC2M</span>':'<span class="px-1.5 py-0.2 rounded text-xs font-bold bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300 mr-1.5">NCC NGO\xC0I</span>',b=Number(s.total_amount)||0,h=Number(s.total_qty)||0;return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-4">
              <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${g(s.po_number)}</span>
            </td>
            <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">
              ${g(Q(s.doc_date))}
            </td>
            <td class="py-3 px-4">
              <div class="flex items-center gap-1">
                ${m}
                <span class="font-medium text-gray-900 dark:text-white">${g(s.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</span>
              </div>
              ${s.supplier_code?`<div class="text-xs text-gray-400 font-mono mt-0.5">M\xE3 NCC: ${g(s.supplier_code)}</div>`:""}
            </td>
            <td class="py-3 px-3 text-center tabular-nums text-xs font-medium text-gray-700 dark:text-gray-300">
              ${s.item_count} m\xE3
            </td>
            <td class="py-3 px-3 text-right tabular-nums text-xs font-semibold text-gray-800 dark:text-gray-200">
              ${h.toFixed(1)}
            </td>
            <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
              ${b>0?Math.round(b).toLocaleString("vi-VN")+" \u0111":"Theo \u0111i\u1EC1u chuy\u1EC3n"}
            </td>
            <td class="py-3 px-3 text-center">
              ${u}
            </td>
            <td class="py-3 px-3 text-center">
              <button type="button" onclick="openPoReceiptModal('${g(s.po_number)}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${l?"bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200":"bg-brand-500 hover:bg-brand-600 text-white shadow-theme-xs"} font-semibold text-xs transition-all">
                <i data-lucide="${l?"eye":"package-plus"}" class="w-3.5 h-3.5"></i>
                <span>${l?"Xem Nh\u1EADp":"Nh\u1EADp Kho"}</span>
              </button>
            </td>
          </tr>
        `}).join("")),o&&(r.length===0?o.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n \u0111\u1EB7t h\xE0ng PO n\xE0o.</div>':o.innerHTML=r.map(s=>{let d=s.status==="COMPLETED",l=(s.po_number||"").startsWith("50000")||!s.supplier_code||s.supplier_name==="B\u1EBFp Trung T\xE2m Siba",u=Number(s.total_amount)||0,p=Number(s.total_qty)||0;return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold ${l?"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300":"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300"}">${l?"B\u1EBEP TRUNG T\xC2M":"NCC NGO\xC0I"}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${g(s.supplier_name||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                <div class="text-xs text-brand-600 dark:text-brand-400 font-mono font-bold mt-0.5">PO: ${g(s.po_number)} \u2022 ${g(Q(s.doc_date))}</div>
              </div>
              <div class="text-right">
                <span class="text-xs font-bold ${d?"text-emerald-600":"text-amber-600"} block">${d?"\u0110\xE3 Nh\u1EADp":"Ch\u1EDD Nh\u1EADp"}</span>
                <span class="text-xs text-gray-400 tabular-nums">${s.item_count} m\u1EB7t h\xE0ng</span>
              </div>
            </div>

            <div class="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-xs tabular-nums">
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng SL:</span>
                <span class="font-bold text-gray-800 dark:text-gray-200 ml-1">${p.toFixed(1)}</span>
              </div>
              <div>
                <span class="text-gray-400 text-xs">T\u1ED5ng ti\u1EC1n:</span>
                <span class="font-bold text-gray-900 dark:text-white ml-1">${u>0?Math.round(u).toLocaleString("vi-VN")+" \u0111":"N\u1ED9i b\u1ED9"}</span>
              </div>
            </div>

            <button type="button" onclick="openPoReceiptModal('${g(s.po_number)}')" class="w-full py-2 rounded-xl ${d?"bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300":"bg-brand-500 text-white shadow-theme-xs"} font-semibold text-xs flex items-center justify-center gap-2">
              <i data-lucide="${d?"eye":"package-plus"}" class="w-4 h-4"></i>
              <span>${d?"Xem Chi Ti\u1EBFt \u0110\u01A1n":"Ki\u1EC3m \u0110\u1EBFm & Nh\u1EADp Kho Th\u1EF1c T\u1EBF"}</span>
            </button>
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function Gt(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i danh s\xE1ch m\u1EB7t h\xE0ng c\u1EE7a PO "+t+"...");let o=await(await fetch(`/api/fnb/po-details?po_number=${encodeURIComponent(t)}&no-cache=1`)).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n PO");let e=o.data;if(!e.length)throw new Error("\u0110\u01A1n PO n\xE0y kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o");let a=e[0],i=document.getElementById("receiptModalInvoice"),r=document.getElementById("receiptModalInvoiceDisplay"),s=document.getElementById("receiptModalSite"),d=document.getElementById("receiptModalSiteDisplay"),l=document.getElementById("receiptModalSupplier"),u=document.getElementById("receiptModalSupplierDisplay"),p=document.getElementById("receiptModalDate"),m=new Date().toISOString().slice(0,10);i&&(i.value=a.po_number),r&&(r.textContent=a.po_number),s&&(s.value=a.site),d&&(d.textContent=a.site),l&&(l.value=a.supplier_name),u&&(u.textContent=a.supplier_name),p&&(p.value=m);let b="L\xD4-"+m.replace(/-/g,"").slice(2),h=new Date;h.setFullYear(h.getFullYear()+1);let c=h.toISOString().slice(0,10);window.gReceiptLines=e.map(f=>{let x=(f.merch_category||"").toLowerCase(),v=!x.includes("bao b\xEC")&&!x.includes("c\xF4ng c\u1EE5")&&!x.includes("h\xF3a ch\u1EA5t")&&!x.includes("t\u1EA1p ph\u1EA9m");return{po_item:f.po_item,item_code:f.item_code,item_name:f.item_name,merch_category:f.merch_category,unit:f.unit||"KG",unit_price:Number(f.unit_price)||0,order_qty:Number(f.order_qty)||0,actual_qty:Number(f.order_qty)||0,batch_code:b,exp_date:v?c:"",is_food:v,note:""}}),Xt();let y=document.getElementById("createReceiptModal");y&&y.classList.remove("hidden")}catch(n){console.error("openPoReceiptModal error:",n),typeof window.showToast=="function"&&window.showToast("L\u1ED7i m\u1EDF \u0111\u01A1n: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function Xt(){let t=document.getElementById("receiptLinesTableBody"),n=document.getElementById("receiptLinesMobileCards"),o=document.getElementById("receiptModalLineCount"),e=document.getElementById("receiptModalTotalAmount"),a=window.gReceiptLines||[];o&&(o.textContent=String(a.length));let i=0;t&&(t.innerHTML=a.map((r,s)=>{let d=(r.actual_qty||0)*(r.unit_price||0);return i+=d,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2.5 px-3 text-center tabular-nums text-gray-400 text-xs">${s+1}</td>
          <td class="py-2.5 px-3">
            <div class="font-bold text-gray-900 dark:text-white text-xs">${g(r.item_name||"V\u1EADt t\u01B0")}</div>
            <div class="text-xs text-gray-400 tabular-nums flex items-center gap-1.5 mt-0.5">
              <span class="font-mono text-brand-600 dark:text-brand-400">${g(r.item_code)}</span>
              ${r.merch_category?`<span>\u2022</span><span>${g(r.merch_category)}</span>`:""}
              ${r.is_food?'<span class="text-emerald-500 font-semibold">\u2022 Th\u1EF1c ph\u1EA9m</span>':'<span class="text-gray-400">\u2022 V\u1EADt t\u01B0</span>'}
            </div>
          </td>
          <td class="py-2.5 px-2 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">
            ${g(r.unit||"")}
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
            <input type="text" value="${g(r.batch_code||"")}" placeholder="L\xF4 SX..." 
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
                ${F(r.exp_date)}
              </div>
            </div>
          </td>
          <td id="receiptLineTotal_${s}" class="py-2.5 px-3 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">
            ${d>0?Math.round(d).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2.5 px-3">
            <input type="text" value="${g(r.note||"")}" placeholder="Ghi ch\xFA..." 
                   oninput="onReceiptLineNoteChange(${s}, this.value)" 
                   class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=a.map((r,s)=>{let d=(r.actual_qty||0)*(r.unit_price||0);return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="text-xs font-mono font-bold text-brand-600 dark:text-brand-400">${g(r.item_code)}</span>
              <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${g(r.item_name||"V\u1EADt t\u01B0")}</h4>
              <div class="text-xs text-gray-400 tabular-nums">\u0110VT: ${g(r.unit||"")} \u2022 \u0110\u01A1n gi\xE1: ${Number(r.unit_price).toLocaleString("vi-VN")} \u0111</div>
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
              <input type="text" value="${g(r.batch_code||"")}" placeholder="L\xF4 SX..." 
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
                ${F(r.exp_date)}
              </div>
            </div>

            <div class="flex items-center gap-2 pt-1">
              <label class="w-24 shrink-0 font-medium text-gray-600 dark:text-gray-400">Ghi ch\xFA d\xF2ng:</label>
              <input type="text" value="${g(r.note||"")}" placeholder="Ghi ch\xFA m\u1EB7t h\xE0ng..." 
                     oninput="onReceiptLineNoteChange(${s}, this.value)" 
                     class="flex-1 py-1.5 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
            </div>
          </div>
        </div>
      `}).join("")),e&&(e.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function $e(t,n){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let o=parseFloat(n);window.gReceiptLines[t].actual_qty=isNaN(o)?0:o;let e=window.gReceiptLines[t],a=(e.actual_qty||0)*(e.unit_price||0),i=document.getElementById(`receiptLineTotal_${t}`);i&&(i.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u0111":"0 \u0111");let r=document.getElementById(`receiptLineTotalMob_${t}`);r&&(r.textContent=a>0?Math.round(a).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let s=0;window.gReceiptLines.forEach(l=>{s+=(l.actual_qty||0)*(l.unit_price||0)});let d=document.getElementById("receiptModalTotalAmount");d&&(d.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u0111":"0 \u0111")}function _e(t,n){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].batch_code=n)}function Be(t,n){if(!window.gReceiptLines||!window.gReceiptLines[t])return;window.gReceiptLines[t].exp_date=n;let o=document.getElementById(`receiptExpWarning_${t}`);o&&(o.innerHTML=F(n));let e=document.getElementById(`receiptExpWarningMob_${t}`);e&&(e.innerHTML=F(n)),window.lucide&&window.lucide.createIcons()}function He(t,n){if(!window.gReceiptLines||!window.gReceiptLines[t])return;let o=new Date;o.setMonth(o.getMonth()+n);let e=o.toISOString().slice(0,10);window.gReceiptLines[t].exp_date=e;let a=document.getElementById(`receiptLineExpInput_${t}`);a&&(a.value=e);let i=document.getElementById(`receiptLineExpInputMob_${t}`);i&&(i.value=e);let r=document.getElementById(`receiptExpWarning_${t}`);r&&(r.innerHTML=F(e));let s=document.getElementById(`receiptExpWarningMob_${t}`);s&&(s.innerHTML=F(e)),window.lucide&&window.lucide.createIcons()}function Ne(t,n){!window.gReceiptLines||!window.gReceiptLines[t]||(window.gReceiptLines[t].note=n)}function Kt(){let t=document.getElementById("createReceiptModal");t&&t.classList.add("hidden")}function Fe(){window.gFnbPoList&&window.gFnbPoList.length?Gt(window.gFnbPoList[0].po_number):typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t \u0111\u01A1n PO t\u1EEB danh s\xE1ch \u0111\u1EC3 ki\u1EC3m \u0111\u1EBFm th\u1EF1c t\u1EBF")}async function De(){let n=(window.gReceiptLines||[]).filter(m=>(m.actual_qty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng th\u1EF1c t\u1EBF l\u1EDBn h\u01A1n 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let o=new Date;o.setHours(0,0,0,0);let e=!1;for(let m of n)if(m.exp_date){let b=new Date(m.exp_date);if(b.setHours(0,0,0,0),b<=o){e=!0;break}}if(e&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c nh\u1EADp kho kh\xF4ng?"))return;let a=document.getElementById("receiptModalSite")?.value||A(),i=document.getElementById("receiptModalInvoice")?.value||"",r=document.getElementById("receiptModalDate")?.value||new Date().toISOString().slice(0,10),s=document.getElementById("receiptModalSupplier")?.value||"B\u1EBFp Trung T\xE2m Siba",d=document.getElementById("receiptModalNotes")?.value||"",l=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Th\u1EE7 Kho",u={site_code:a,receipt_date:r,supplier:s,invoice_no:i,notes:d,created_by:l,lines:n.map(m=>({item_code:m.item_code,qty:m.actual_qty,unit_price:m.unit_price,batch_code:(m.batch_code||"").trim(),exp_date:(m.exp_date||"").trim()||null,note:m.note||""}))},p=document.getElementById("btnSubmitReceipt");p&&(p.disabled=!0,p.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let b=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(u)})).json();if(!b.success)throw new Error(b.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\xE0nh c\xF4ng phi\u1EBFu ${b.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${a} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Kt(),await J(a),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(a),nt("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(m){console.error("submitCreateReceipt error:",m),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho: "+m.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),p&&(p.disabled=!1,p.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}async function Re(t){let n=t||A(),o=document.getElementById("fnbReceiptsTableBody"),e=document.getElementById("fnbReceiptsMobileCards");try{let i=await(await fetch(`/api/fnb/receipts?site_code=${encodeURIComponent(n)}&no-cache=1`)).json();if(i.success&&i.data){let r=i.data.receipts||[],s=document.getElementById("fnbReceiptBadgeHistoryCount");s&&(s.textContent=String(r.length)),o&&(r.length?o.innerHTML=r.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${g(d.receipt_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${g(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums font-mono text-gray-600 dark:text-gray-300 text-xs">${g(Q(d.receipt_date))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${g(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</td>
              <td class="py-3 px-3 font-mono font-medium text-gray-600 dark:text-gray-400 text-xs">${g(d.invoice_no||"\u2014")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-gray-900 dark:text-white">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-3 px-3 text-gray-500 text-xs">${g(d.created_by||"Th\u1EE7 kho")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewReceiptDetail(${d.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):o.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o cho \u0111i\u1EC3m b\xE1n ${g(n)}.</td></tr>`),e&&(r.length?e.innerHTML=r.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-brand-600 dark:text-brand-400 text-xs">${g(d.receipt_code)}</span>
                  <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-0.5">${g(d.supplier||"B\u1EBFp Trung T\xE2m Siba")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y nh\u1EADp: ${g(Q(d.receipt_date))} \u2022 PO: ${g(d.invoice_no||"\u2014")}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-gray-900 dark:text-white tabular-nums block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u0111</span>
                  <span class="text-xs text-gray-400">${g(d.created_by||"Th\u1EE7 kho")}</span>
                </div>
              </div>
            </div>
          `).join(""):e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 phi\u1EBFu nh\u1EADp kho n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(a){console.error("loadFnbReceiptsHistory error:",a)}}async function Ae(t){try{typeof window.showLoading=="function"&&window.showLoading();let o=await(await fetch(`/api/fnb/receipts?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu nh\u1EADp");let e=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Nh\u1EADp #${t}`),r&&(r.textContent=`${e.length} m\u1EB7t h\xE0ng nh\u1EADp kho`);let s=`
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
            ${e.map(l=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${g(l.item_name||l.item_code)}</td>
                <td class="py-2 px-2 text-center text-gray-500">${g(l.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-brand-600 font-mono">${Number(l.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-center font-mono text-xs text-gray-700 dark:text-gray-300 font-semibold whitespace-nowrap">${g(l.batch_code||"--")}</td>
                <td class="py-2 px-3 text-center font-mono text-xs whitespace-nowrap ${l.exp_date?"text-brand-600 dark:text-brand-400 font-semibold":"text-gray-400"}">${g(l.exp_date?String(l.exp_date).slice(0,10):"--")}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(l.unit_price).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(l.amount).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${g(l.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=s),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function Oe(t){let n=t||localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||A()||"K001",e=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(y=>y.code.toUpperCase()===n.toUpperCase()),a=e?e.ten||e.name:n,i=a.startsWith(n)?a:`${n} - ${a}`,r=document.getElementById("manualReceiptSiteNameDisplay");r&&(r.textContent=i);let s=document.getElementById("manualReceiptSiteSelect");s&&(s.value=n);let d=document.getElementById("manualReceiptSiteBadge");d&&(d.textContent=n);let l=document.getElementById("manualReceiptDate");l&&(l.value=new Date().toISOString().slice(0,10));let u=document.getElementById("manualReceiptSupplier");u&&!u.value&&(u.value="Ch\u1EE3 \u0111\u1EA7u m\u1ED1i / Mua l\u1EBB \u0111\u1ECBa ph\u01B0\u01A1ng");let p=document.getElementById("manualReceiptInvoiceNo");p&&(p.value="");let m=document.getElementById("manualReceiptNotes");m&&(m.value="");let b=document.getElementById("manualItemSearchInput");b&&(b.value="");let h=document.getElementById("manualItemCategorySelect");h&&(h.value=""),window.gManualReceiptLines=[],ot();let c=document.getElementById("modalManualReceipt");c&&c.classList.remove("hidden"),await ct(n,window.gManualShowAllCatalog),window.lucide&&window.lucide.createIcons()}function Qt(){let t=document.getElementById("modalManualReceipt");t&&t.classList.add("hidden")}async function Pe(t){let n=document.getElementById("manualReceiptSiteBadge");n&&(n.textContent=t),await ct(t,window.gManualShowAllCatalog)}async function je(){window.gManualShowAllCatalog=!window.gManualShowAllCatalog;let t=document.getElementById("txtToggleManualCatalog");t&&(t.textContent=window.gManualShowAllCatalog?"Xem ch\u1EC9 c\u1EE7a site":"Xem to\xE0n chu\u1ED7i");let n=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001";await ct(n,window.gManualShowAllCatalog)}async function ct(t,n){let o=document.getElementById("manualCatalogListContainer");o&&(o.innerHTML=`
      <div class="p-8 text-center text-gray-400 text-xs">
        <i data-lucide="loader-2" class="w-5 h-5 animate-spin mx-auto mb-2 text-emerald-500"></i>
        <span>\u0110ang t\u1EA3i danh m\u1EE5c m\u1EB7t h\xE0ng...</span>
      </div>
    `,window.lucide&&window.lucide.createIcons());try{let e=`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}${n?"&include_all=1":""}`,i=await(await fetch(e)).json();i.success&&i.data?window.gManualSiteCatalog=i.data.items||[]:window.gManualSiteCatalog=[],Z()}catch(e){console.error("loadManualCatalogItems error:",e),o&&(o.innerHTML=`<div class="p-4 text-center text-rose-500 text-xs">L\u1ED7i khi t\u1EA3i danh m\u1EE5c: ${g(e.message)}</div>`)}}function Z(){let t=document.getElementById("manualCatalogListContainer"),n=document.getElementById("manualCatalogCountText"),o=(document.getElementById("manualItemSearchInput")?.value||"").trim().toLowerCase(),e=(document.getElementById("manualItemCategorySelect")?.value||"").trim().toLowerCase(),a=window.gManualSiteCatalog||[];if(o&&(a=a.filter(i=>{let r=(i.code||i.sku||"").toLowerCase(),s=(i.name||"").toLowerCase();return r.includes(o)||s.includes(o)})),e&&(a=a.filter(i=>(i.nhom_hang||i.item_group||i.nganh_hang||"").toLowerCase().includes(e))),n&&(n.textContent=String(a.length)),!!t){if(!a.length){t.innerHTML=`
      <div class="p-6 text-center text-gray-400 text-xs bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
        Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p ${o?`v\u1EDBi t\u1EEB kh\xF3a "${g(o)}"`:""}.
      </div>
    `;return}t.innerHTML=a.map(i=>{let r=i.code||i.sku,s=(window.gManualReceiptLines||[]).find(u=>u.item_code===r),d=parseFloat(i.book_qty||0),l=parseFloat(i.unit_price||0);return`
      <div onclick="addManualReceiptItem('${r}')" class="p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${s?"bg-emerald-50/70 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-700/80 shadow-xs":"bg-white dark:bg-gray-900 border-gray-200/80 dark:border-gray-800 hover:border-emerald-400 hover:shadow-xs"}">
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-1.5 flex-wrap">
            <span class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[210px]" title="${g(i.name||r)}">
              ${g(i.name||r)}
            </span>
            <span class="text-xs px-1.5 py-0.2 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-medium">
              ${g(i.unit||"Ph\u1EA7n")}
            </span>
          </div>
          <div class="flex items-center gap-2 text-xs text-gray-400 font-mono mt-0.5">
            <span class="text-brand-600 dark:text-brand-400 font-semibold">${g(r)}</span>
            <span>\u2022</span>
            <span>T\u1ED3n: <b class="${d>0?"text-emerald-600":"text-gray-500"} font-mono">${d.toFixed(1)}</b></span>
            <span>\u2022</span>
            <span>Gi\xE1: ${l>0?Math.round(l).toLocaleString("vi-VN")+"\u0111":"\u2014"}</span>
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
    `}).join(""),window.lucide&&window.lucide.createIcons()}}function Ve(t){let n=(window.gManualSiteCatalog||[]).find(e=>(e.code||e.sku)===t);if(!n)return;let o=(window.gManualReceiptLines||[]).find(e=>e.item_code===t);if(o)o.qty=Math.round((o.qty+1)*100)/100;else{let a="L\xD4-"+(document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10)).replace(/-/g,"").slice(2),i=new Date;i.setFullYear(i.getFullYear()+1);let r=i.toISOString().slice(0,10);window.gManualReceiptLines.push({item_code:n.code||n.sku,item_name:n.name||n.code,unit:n.unit||"Ph\u1EA7n",unit_price:parseFloat(n.unit_price||0),qty:1,batch_code:a,exp_date:r,storage_loc:"K\u1EC7 B\u1EBFp",note:""})}ot(),Z()}function ot(){let t=document.getElementById("manualLinesEmptyState"),n=document.getElementById("manualLinesTableWrapper"),o=document.getElementById("manualLinesMobileCards"),e=document.getElementById("btnClearAllManualLines"),a=document.getElementById("manualLinesTableBody"),i=document.getElementById("manualSelectedCountText"),r=document.getElementById("manualSummaryTotalSkus"),s=document.getElementById("manualSummaryTotalQty"),d=document.getElementById("manualSummaryTotalAmount"),l=window.gManualReceiptLines||[];if(i&&(i.textContent=String(l.length)),r&&(r.textContent=l.length+" m\xE3"),!l.length){t&&t.classList.remove("hidden"),n&&(n.classList.add("hidden"),n.classList.remove("lg:block")),o&&(o.classList.add("hidden"),o.classList.remove("block")),e&&(e.classList.add("hidden"),e.classList.remove("flex")),s&&(s.textContent="0"),d&&(d.textContent="0 \u0111");return}t&&t.classList.add("hidden"),n&&(n.classList.remove("hidden"),n.classList.add("lg:block")),o&&(o.classList.remove("hidden"),o.classList.add("block")),e&&(e.classList.remove("hidden"),e.classList.add("flex"));let u=0,p=0;a&&(a.innerHTML=l.map((m,b)=>{let h=(m.qty||0)*(m.unit_price||0);return u+=m.qty||0,p+=h,`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-2 px-2 text-center text-gray-400 tabular-nums font-mono text-xs">${b+1}</td>
          <td class="py-2 px-2.5 min-w-[130px]">
            <div class="font-bold text-gray-900 dark:text-white text-xs truncate max-w-[150px]" title="${g(m.item_name)}">
              ${g(m.item_name)}
            </div>
            <div class="text-xs text-gray-400 font-mono flex items-center gap-1.5 mt-0.5">
              <span class="text-brand-600 dark:text-brand-400">${g(m.item_code)}</span>
              <span>\u2022</span>
              <span class="font-sans font-medium text-gray-600 dark:text-gray-300">${g(m.unit||"")}</span>
            </div>
          </td>
          <td class="py-2 px-2 text-center w-20">
            <input type="number" step="0.01" min="0.01" value="${m.qty}" 
                   oninput="onManualLineQtyChange(${b}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 dark:bg-brand-950/20 font-bold font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:ring-1 focus:ring-brand-500">
          </td>
          <td class="py-2 px-2 text-right w-24">
            <input type="number" step="100" min="0" value="${m.unit_price}" 
                   oninput="onManualLinePriceChange(${b}, this.value)" 
                   class="w-24 text-right py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs tabular-nums text-gray-900 dark:text-white outline-none focus:border-brand-500">
          </td>
          <td id="manualLineTotal_${b}" class="py-2 px-2 text-right font-mono font-bold text-xs tabular-nums text-brand-600 dark:text-brand-400 whitespace-nowrap">
            ${h>0?Math.round(h).toLocaleString("vi-VN")+" \u0111":"0 \u0111"}
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${g(m.batch_code||"")}" placeholder="L\xF4..." 
                   oninput="onManualLineBatchChange(${b}, this.value)" 
                   class="w-24 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="date" value="${m.exp_date||""}" 
                   onchange="onManualLineExpChange(${b}, this.value)" 
                   class="w-32 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <input type="text" value="${g(m.storage_loc||"")}" placeholder="V\u1ECB tr\xED..." 
                   oninput="onManualLineLocChange(${b}, this.value)" 
                   class="w-20 text-center py-1 px-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 font-mono text-xs text-gray-800 dark:text-gray-200 outline-none focus:border-brand-500">
          </td>
          <td class="py-2 px-2 text-center">
            <button type="button" onclick="removeManualReceiptLine(${b})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=l.map((m,b)=>{let h=(m.qty||0)*(m.unit_price||0);return`
        <div class="data-card space-y-2.5 p-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3">
          <div class="flex items-start justify-between gap-2 border-b border-gray-100 dark:border-gray-800 pb-2">
            <div>
              <div class="flex items-center gap-1.5 mb-0.5">
                <span class="badge badge-neutral text-xs">#${b+1}</span>
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono">${g(m.item_code)}</span>
              </div>
              <div class="font-bold text-xs text-gray-900 dark:text-white truncate">${g(m.item_name)}</div>
            </div>
            <button type="button" onclick="removeManualReceiptLine(${b})" class="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors" title="X\xF3a m\u1EB7t h\xE0ng n\xE0y">
              <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">S\u1ED1 l\u01B0\u1EE3ng (${g(m.unit||"")}):</label>
              <input type="number" step="0.01" min="0.01" value="${m.qty}" 
                     oninput="onManualLineQtyChange(${b}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-brand-300 dark:border-brand-700 bg-brand-50/30 font-mono text-center font-bold text-xs">
            </div>
            <div>
              <label class="text-gray-400 block text-[11px] mb-1">\u0110\u01A1n gi\xE1 (\u20AB):</label>
              <input type="number" step="100" min="0" value="${m.unit_price}" 
                     oninput="onManualLinePriceChange(${b}, this.value)" 
                     class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-right font-medium text-xs">
            </div>
          </div>
          <div class="flex items-center justify-between text-xs pt-1.5 border-t border-gray-100 dark:border-gray-800">
            <span class="text-gray-400 text-[11px]">Th\xE0nh ti\u1EC1n:</span>
            <span class="num font-bold text-emerald-600 dark:text-emerald-400 text-sm font-mono">${h>0?Math.round(h).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs pt-1">
            <input type="text" value="${g(m.batch_code||"")}" placeholder="M\xE3 l\xF4..." 
                   oninput="onManualLineBatchChange(${b}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
            <input type="date" value="${m.exp_date||""}" 
                   onchange="onManualLineExpChange(${b}, this.value)" 
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-mono">
          </div>
        </div>
      `}).join("")),s&&(s.textContent=u>0?Number.isInteger(u)?String(u):u.toFixed(1):"0"),d&&(d.textContent=p>0?Math.round(p).toLocaleString("vi-VN")+" \u0111":"0 \u0111"),window.lucide&&window.lucide.createIcons()}function We(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=parseFloat(n);window.gManualReceiptLines[t].qty=isNaN(o)?0:o,kt()}function qe(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=parseFloat(n);window.gManualReceiptLines[t].unit_price=isNaN(o)?0:o,kt()}function kt(){let t=0,n=0;(window.gManualReceiptLines||[]).forEach((a,i)=>{let r=(a.qty||0)*(a.unit_price||0);t+=a.qty||0,n+=r;let s=document.getElementById(`manualLineTotal_${i}`);s&&(s.textContent=r>0?Math.round(r).toLocaleString("vi-VN")+" \u0111":"0 \u0111")});let o=document.getElementById("manualSummaryTotalQty"),e=document.getElementById("manualSummaryTotalAmount");o&&(o.textContent=t.toFixed(1)),e&&(e.textContent=Math.round(n).toLocaleString("vi-VN")+" \u0111")}function Ue(t,n){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].batch_code=n)}function Ge(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;window.gManualReceiptLines[t].exp_date=n;let o=document.getElementById(`manualLineExpWarning_${t}`);o&&(o.innerHTML=F(n),window.lucide&&window.lucide.createIcons())}function Xe(t,n){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let o=new Date;o.setMonth(o.getMonth()+n);let e=o.toISOString().slice(0,10);window.gManualReceiptLines[t].exp_date=e;let a=document.getElementById(`manualLineExpInput_${t}`);a&&(a.value=e);let i=document.getElementById(`manualLineExpWarning_${t}`);i&&(i.innerHTML=F(e),window.lucide&&window.lucide.createIcons())}function Ke(t,n){!window.gManualReceiptLines||!window.gManualReceiptLines[t]||(window.gManualReceiptLines[t].storage_loc=n)}function Jt(t){if(!window.gManualReceiptLines||!window.gManualReceiptLines[t])return;let n=window.gManualReceiptLines[t];window.gManualReceiptLines.splice(t,1),ot(),typeof Z=="function"&&Z(),typeof window.showToast=="function"&&window.showToast('\u0110\xE3 x\xF3a "'+(n.item_name||n.item_code)+'" kh\u1ECFi phi\u1EBFu nh\u1EADp',"info")}function zt(){let t=window.gManualReceiptLines||[];if(!t.length){typeof window.showToast=="function"&&window.showToast("Phi\u1EBFu nh\u1EADp hi\u1EC7n t\u1EA1i ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 x\xF3a.","info");return}let n=document.getElementById("confirmClearManualCountText");n&&(n.textContent=String(t.length));let o=document.getElementById("modalConfirmClearManualLines");o&&(o.classList.remove("hidden"),window.lucide&&window.lucide.createIcons())}function Yt(){let t=document.getElementById("modalConfirmClearManualLines");t&&t.classList.add("hidden")}function Qe(){let t=(window.gManualReceiptLines||[]).length;window.gManualReceiptLines=[],Yt(),ot(),Z(),typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\xE0m tr\u1ED1ng to\xE0n b\u1ED9 ${t} m\u1EB7t h\xE0ng tr\xEAn phi\u1EBFu nh\u1EADp`,"info")}async function Je(){let n=(window.gManualReceiptLines||[]).filter(h=>(h.qty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng l\u1EDBn h\u01A1n 0!");return}let o=(document.getElementById("manualReceiptSupplier")?.value||"").trim();if(!o){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp t\xEAn Nh\xE0 cung c\u1EA5p ho\u1EB7c ngu\u1ED3n h\xE0ng!"),document.getElementById("manualReceiptSupplier")?.focus();return}let e=new Date;e.setHours(0,0,0,0);let a=!1;for(let h of n)if(h.exp_date){let c=new Date(h.exp_date);if(c.setHours(0,0,0,0),c<=e){a=!0;break}}if(a&&!confirm("C\u1EA3nh b\xE1o: C\xF3 m\u1EB7t h\xE0ng c\xF3 H\u1EA1n D\xF9ng (EXP) \u0111\xE3 h\u1EBFt h\u1EA1n ho\u1EB7c h\u1EBFt h\u1EA1n h\xF4m nay. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n nh\u1EADp kho kh\xF4ng?"))return;let i=localStorage.getItem("orbit_user_site")||window.gCurrentUser&&window.gCurrentUser.assignedSite||document.getElementById("manualReceiptSiteSelect")?.value||"K001",r=document.getElementById("manualReceiptDate")?.value||new Date().toISOString().slice(0,10),s=document.getElementById("manualReceiptType")?.value||"NHAP_MUA_TRUC_TIEP",d=(document.getElementById("manualReceiptInvoiceNo")?.value||"").trim()||"NHAP-THU-CONG",l=(document.getElementById("manualReceiptNotes")?.value||"").trim(),u=`[${s}] ${l}`.trim(),p=window.gCurrentUser&&(window.gCurrentUser.fullName||window.gCurrentUser.name)||"Th\u1EE7 kho / B\u1EBFp tr\u01B0\u1EDFng",m={site_code:i,receipt_date:r,supplier:o,invoice_no:d,notes:u,created_by:p,lines:n.map(h=>({item_code:h.item_code,qty:h.qty,unit_price:h.unit_price,batch_code:(h.batch_code||"").trim(),exp_date:(h.exp_date||"").trim()||null,storage_loc:h.storage_loc||"K\u1EC7 B\u1EBFp",note:h.note||""}))},b=document.getElementById("btnSubmitManualReceipt");b&&(b.disabled=!0,b.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang ghi nh\u1EADn nh\u1EADp kho...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang nh\u1EADp kho v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let c=await(await fetch("/api/fnb/receipts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(m)})).json();if(!c.success)throw new Error(c.error||"L\u1ED7i khi nh\u1EADp kho");typeof window.showToast=="function"&&window.showToast(`Nh\u1EADp kho th\u1EE7 c\xF4ng th\xE0nh c\xF4ng phi\u1EBFu ${c.data.receipt_code}! T\u1ED3n kho \u0111i\u1EC3m ${i} \u0111\xE3 \u0111\u01B0\u1EE3c c\u1ED9ng t\u1EF1 \u0111\u1ED9ng.`),Qt(),await J(i),typeof window.loadFnbReceiptsHistory=="function"&&await window.loadFnbReceiptsHistory(i),nt("history"),typeof window.loadWhInventory=="function"&&window.loadWhInventory(),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(h){console.error("submitManualReceipt error:",h),typeof window.showToast=="function"&&window.showToast("L\u1ED7i nh\u1EADp kho th\u1EE7 c\xF4ng: "+h.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),b&&(b.disabled=!1,b.innerHTML='<i data-lucide="check-circle-2" class="w-4 h-4"></i> X\xE1c Nh\u1EADn &amp; Nh\u1EADp Kho'),window.lucide&&window.lucide.createIcons()}}var w=window;w.gFnbReceiptCurrentView=w.gFnbReceiptCurrentView||"po";w.gFnbPoList=w.gFnbPoList||[];w.gReceiptLines=w.gReceiptLines||[];w.gManualReceiptLines=w.gManualReceiptLines||[];w.gManualSiteCatalog=w.gManualSiteCatalog||[];w.gManualShowAllCatalog=w.gManualShowAllCatalog||!1;w.getActiveFnbReceiptSite=A;w.formatReceiptDateYMD=Q;w.getReceiptExpWarningHtml=F;w.switchFnbReceiptSubView=nt;w.loadFnbReceipts=Ie;w.onFnbPoSearchInput=Me;w.loadFnbPoList=J;w.renderFnbPoTable=vt;w.openPoReceiptModal=Gt;w.renderReceiptLinesTable=Xt;w.onReceiptLineQtyChange=$e;w.onReceiptLineBatchChange=_e;w.onReceiptLineExpChange=Be;w.setReceiptLineQuickExp=He;w.onReceiptLineNoteChange=Ne;w.closeCreateReceiptModal=Kt;w.openCreateReceiptModal=Fe;w.submitCreateReceipt=De;w.loadFnbReceiptsHistory=Re;w.viewReceiptDetail=Ae;w.openManualReceiptModal=Oe;w.closeManualReceiptModal=Qt;w.onManualReceiptSiteChange=Pe;w.toggleManualShowAllCatalog=je;w.loadManualCatalogItems=ct;w.filterManualCatalogList=Z;w.addManualReceiptItem=Ve;w.renderManualReceiptLinesTable=ot;w.onManualLineQtyChange=We;w.onManualLinePriceChange=qe;w.updateManualTotals=kt;w.onManualLineBatchChange=Ue;w.onManualLineExpChange=Ge;w.setManualLineQuickExp=Xe;w.onManualLineLocChange=Ke;w.removeManualReceiptLine=Jt;w.removeManualLine=Jt;w.confirmClearAllManualReceiptLines=zt;w.clearAllManualReceiptLines=zt;w.closeConfirmClearManualLinesModal=Yt;w.executeClearAllManualReceiptLines=Qe;w.submitManualReceipt=Je;function O(){let t=document.getElementById("globalBranchSelect")?.value,n=localStorage.getItem("orbit_user_site"),o=window,e=typeof o.App<"u"&&o.App.currentBranch?o.App.currentBranch.toUpperCase():null,a=document.getElementById("fnbWasteFilterSite")?.value,i=t||n||e||a||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function Zt(){let t=document.getElementById("fnbWasteFilterSite");if(!t)return;let n=t.value||O(),o=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).filter(e=>e.code!=="ALL");if(o&&o.length){let e="";o.forEach(a=>{e+=`<option value="${a.code}" ${a.code.toUpperCase()===n.toUpperCase()?"selected":""}>${a.name}</option>`}),t.innerHTML=e,n&&Array.from(t.options).some(a=>a.value===n)&&(t.value=n)}}function at(t){let n=document.getElementById("subtab-fnb-waste-stock"),o=document.getElementById("subtab-fnb-waste-history"),e=document.getElementById("fnbWasteSubViewStock"),a=document.getElementById("fnbWasteSubViewHistory");t==="history"?(n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),e&&e.classList.add("hidden"),a&&a.classList.remove("hidden")):(n&&(n.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 bg-white dark:bg-white/3 text-gray-900 dark:text-white shadow-xs border border-gray-200/60 dark:border-gray-700"),o&&(o.className="px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"),e&&e.classList.remove("hidden"),a&&a.classList.add("hidden")),window.lucide&&window.lucide.createIcons()}async function te(t){let n=t||O(),o=document.getElementById("fnbWasteTableBody"),e=document.getElementById("fnbWasteMobileCards"),a=document.getElementById("fnbWasteBadgeHistoryCount");try{let r=await(await fetch(`/api/fnb/wastes?site_code=${encodeURIComponent(n)}&no-cache=1`)).json();if(r.success&&r.data){let s=r.data.wastes||[];a&&(a.textContent=String(s.length)),o&&(s.length?o.innerHTML=s.map(d=>`
            <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
              <td class="py-3 px-4 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${g(d.waste_code)}</td>
              <td class="py-3 px-3 font-semibold text-gray-800 dark:text-gray-200 text-xs">${g(d.site_code)}</td>
              <td class="py-3 px-3 tabular-nums text-gray-600 dark:text-gray-300 text-xs">${g(String(d.waste_date||"").slice(0,10))}</td>
              <td class="py-3 px-4 font-medium text-gray-900 dark:text-white text-xs">${g(d.reason||"H\xE0ng h\u1ECFng")}</td>
              <td class="py-3 px-3 text-gray-600 dark:text-gray-300 text-xs">${g(d.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</td>
              <td class="py-3 px-4 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u20AB</td>
              <td class="py-3 px-4 text-gray-500 text-xs">${g(d.notes||"\u2014")}</td>
              <td class="py-3 px-3 text-center">
                <button type="button" onclick="viewWasteDetail(${d.id})" class="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors" title="Xem chi ti\u1EBFt">
                  <i data-lucide="eye" class="w-4 h-4"></i>
                </button>
              </td>
            </tr>
          `).join(""):o.innerHTML=`<tr><td colspan="8" class="text-center py-10 text-gray-400">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o cho \u0111i\u1EC3m b\xE1n ${g(n)}.</td></tr>`),e&&(s.length?e.innerHTML=s.map(d=>`
            <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${g(d.waste_code)}</span>
                  <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${g(d.reason||"H\xE0ng h\u1ECFng")}</h4>
                  <div class="text-xs text-gray-400 tabular-nums">Ng\xE0y: ${g(String(d.waste_date||"").slice(0,10))} \u2022 \u0110i\u1EC3m: ${g(d.site_code)}</div>
                </div>
                <div class="text-right">
                  <span class="font-bold text-xs text-rose-600 dark:text-rose-400 tabular-nums font-mono block">${Math.round(d.total_amount||0).toLocaleString("vi-VN")} \u20AB</span>
                  <span class="text-xs text-gray-400">${g(d.confirmed_by||"B\u1EBFp tr\u01B0\u1EDFng")}</span>
                </div>
              </div>
            </div>
          `).join(""):e.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Ch\u01B0a c\xF3 bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng n\xE0o.</div>'),window.lucide&&window.lucide.createIcons()}}catch(i){console.error("loadFnbWasteHistory error:",i)}}async function ze(t){try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA3i chi ti\u1EBFt bi\xEAn b\u1EA3n...");let o=await(await fetch(`/api/fnb/wastes?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c bi\xEAn b\u1EA3n h\u1EE7y");let e=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Bi\xEAn B\u1EA3n H\u1EE7y #${t}`),r&&(r.textContent=`${e.length} m\u1EB7t h\xE0ng b\u1ECB h\u1EE7y`);let s=`
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
            ${e.map(l=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">
                  <div>${g(l.item_name||l.item_code)}</div>
                  <div class="text-xs text-gray-400 font-mono">${g(l.item_code)}</div>
                </td>
                <td class="py-2 px-2 text-center text-gray-500">${g(l.unit||"")}</td>
                <td class="py-2 px-3 text-right font-bold text-rose-600 font-mono">${Number(l.qty).toFixed(1)}</td>
                <td class="py-2 px-3 text-right text-gray-500">${Number(l.unit_price).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 text-right font-bold text-gray-900 dark:text-white">${Math.round(l.amount).toLocaleString("vi-VN")} \u20AB</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${g(l.reason_detail||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=s),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function ee(){let t=document.getElementById("fnbWasteNganhHangFilter"),n=document.getElementById("fnbWasteNhomHangFilter");if(!t||!n)return;let o=new Map;(window.gFnbWasteStockItems||[]).forEach(a=>{let i=(a.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),r=(a.nhom_hang||a.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();o.has(i)||o.set(i,new Set),o.get(i).add(r)}),window.gFnbWasteNganhMap=o;let e='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(o.keys()).sort().forEach(a=>{e+=`<option value="${g(a)}">${g(a)}</option>`}),t.innerHTML=e,t.value="",Lt("")}function Lt(t){let n=document.getElementById("fnbWasteNhomHangFilter");if(!n)return;let o=new Set;window.gFnbWasteNganhMap&&(t&&window.gFnbWasteNganhMap.has(t)?window.gFnbWasteNganhMap.get(t).forEach(a=>o.add(a)):window.gFnbWasteNganhMap.forEach(a=>a.forEach(i=>o.add(i))));let e='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(o).sort().forEach(a=>{e+=`<option value="${g(a)}">${g(a)}</option>`}),n.innerHTML=e,n.value=""}function Ye(){let t=document.getElementById("fnbWasteNganhHangFilter")?.value||"";Lt(t),rt()}function Ze(){rt()}function tn(t){rt()}function en(){typeof window.loadFnbWaste=="function"&&window.loadFnbWaste()}function rt(){let t=document.getElementById("fnbWasteStockTableBody"),n=document.getElementById("fnbWasteStockMobileCards"),o=document.getElementById("fnbWasteStockEmptyState"),e=document.getElementById("fnbWasteSummary"),a=document.getElementById("fnbWasteBadgeInStockCount"),i=(document.getElementById("fnbWasteNganhHangFilter")?.value||"").trim().toLowerCase(),r=(document.getElementById("fnbWasteNhomHangFilter")?.value||"").trim().toLowerCase(),s=(document.getElementById("fnbWasteReasonFilter")?.value||"").trim(),d=(document.getElementById("fnbWasteSearchInput")?.value||"").trim().toLowerCase(),l=window.gFnbWasteStockItems||[],u=document.getElementById("kpiWasteInStockCount"),p=document.getElementById("kpiWasteInStockVal");u&&(u.textContent=String(l.length));let m=0;if(l.forEach(c=>{m+=Number(c.total_value)||Number(c.book_qty)*Number(c.unit_price)||0}),p){let c=qt(m);p.innerHTML=`${c.val}<span class="kpi-unit">${c.unit}</span>`}a&&(a.textContent=String(l.length));let b=l.filter(c=>{if(s==="EXP"&&(c.days_remaining!==void 0?Number(c.days_remaining):999)>15&&!c.is_expired||i&&(c.nganh_hang||"").trim().toLowerCase()!==i||r&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==r)return!1;if(d){let y=(c.name||"").toLowerCase(),f=(c.code||"").toLowerCase();if(!y.includes(d)&&!f.includes(d))return!1}return!0});if(e&&(e.textContent=`Hi\u1EC3n th\u1ECB ${b.length} / ${l.length} m\u1EB7t h\xE0ng c\xF3 t\u1ED3n > 0`),St(),!b.length){t&&(t.innerHTML=""),n&&(n.innerHTML=""),o&&o.classList.remove("hidden");return}o&&o.classList.add("hidden");let h=["H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n","Qu\xE1 h\u1EA1n s\u1EED d\u1EE5ng (HSD)","R\xE1ch v\u1EE1 bao b\xEC / \u0111\u1ED5 v\u1EE1 khi v\u1EADn chuy\u1EC3n","D\u1EADp n\xE1t h\u01B0 h\u1ECFng sau s\u01A1 ch\u1EBF","N\u1EA5u th\u1EED m\xF3n m\u1EDBi & m\u1EABu l\u01B0u ki\u1EC3m th\u1EF1c","N\u1EA5u d\u01B0 cu\u1ED1i ng\xE0y kh\xF4ng b\u1EA3o qu\u1EA3n \u0111\u01B0\u1EE3c","Hao h\u1EE5t \u0111\u1ECBnh m\u1EE9c kh\xE1c"];t&&(t.innerHTML=b.map((c,y)=>{let f=Number(c.book_qty)||0,x=Number(c.unit_price)||0,v=Number(c.total_value)||f*x,k=c.wasteQty||0,I=k*x;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${y+1}</td>
          <td class="py-3 px-3 font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${g(c.code)}</td>
          <td class="py-3 px-4">
            <div class="font-semibold text-gray-900 dark:text-white text-xs">${g(c.name||c.code)}</div>
            <div class="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
              <span>${g(c.nganh_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
              ${c.nhom_hang&&c.nhom_hang!==c.nganh_hang?`<span>\u2022</span><span>${g(c.nhom_hang)}</span>`:""}
            </div>
          </td>
          <td class="py-3 px-2 text-center text-xs font-semibold text-gray-600 dark:text-gray-300">
            ${g(c.unit||"Ph\u1EA7n")}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(x).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20 font-mono">
            ${f.toFixed(1)}
          </td>
          <td class="py-3 px-3 text-right tabular-nums text-xs text-gray-600 dark:text-gray-300 font-mono">
            ${Math.round(v).toLocaleString("vi-VN")} \u20AB
          </td>
          <td class="py-3 px-3 text-center bg-rose-50/30 dark:bg-rose-950/20">
            <input type="number" step="0.01" min="0" max="${f}" value="${k>0?k:""}" placeholder="0"
                   oninput="onWasteLineQtyChange('${g(c.code)}', this.value)"
                   class="w-24 text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 font-mono">
          </td>
          <td class="py-3 px-3">
            <select onchange="onWasteLineReasonChange('${g(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${h.map(T=>`<option value="${g(T)}" ${c.wasteReason===T?"selected":""}>${g(T)}</option>`).join("")}
            </select>
          </td>
          <td id="wasteLineTotal_${g(c.code)}" class="py-3 px-3 text-right tabular-nums text-xs font-bold text-rose-600 dark:text-rose-400 font-mono">
            ${I>0?Math.round(I).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
          </td>
          <td class="py-3 px-3">
            <input type="text" placeholder="Ghi ch\xFA..." value="${g(c.wasteNote||"")}"
                   oninput="onWasteLineNoteChange('${g(c.code)}', this.value)"
                   class="w-full py-1 px-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-rose-500">
          </td>
        </tr>
      `}).join("")),n&&(n.innerHTML=b.map(c=>{let y=Number(c.book_qty)||0,f=Number(c.unit_price)||0,x=c.wasteQty||0,v=x*f;return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <span class="font-mono font-bold text-rose-600 dark:text-rose-400 text-xs">${g(c.code)}</span>
              <h4 class="font-semibold text-sm text-gray-900 dark:text-white mt-0.5">${g(c.name||c.code)}</h4>
              <div class="text-xs text-gray-400">${g(c.nganh_hang||c.item_group||"")}</div>
            </div>
            <div class="text-right">
              <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums font-mono">T\u1ED3n: ${y.toFixed(1)} ${g(c.unit||"")}</span>
              <div class="text-xs text-gray-400 tabular-nums font-mono">${Math.round(f).toLocaleString("vi-VN")} \u20AB / ${g(c.unit||"")}</div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
            <div>
              <label class="block text-xs font-bold text-rose-600 dark:text-rose-400 mb-1">SL C\u1EA7n H\u1EE7y (T\u1ED1i \u0111a ${y.toFixed(1)})</label>
              <input type="number" step="0.01" min="0" max="${y}" value="${x>0?x:""}" placeholder="0"
                     oninput="onWasteLineQtyChange('${g(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-rose-300 dark:border-rose-700 bg-white dark:bg-gray-800 font-bold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-rose-500 text-xs font-mono">
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">Th\xE0nh Ti\u1EC1n H\u1EE7y</label>
              <div id="mobWasteLineTotal_${g(c.code)}" class="py-1.5 px-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-xs font-bold text-rose-600 dark:text-rose-400 tabular-nums text-right font-mono">
                ${v>0?Math.round(v).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"}
              </div>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1">L\xFD Do H\u1EE7y</label>
            <select onchange="onWasteLineReasonChange('${g(c.code)}', this.value)" class="w-full py-1.5 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs outline-none focus:border-rose-500">
              ${h.map(k=>`<option value="${g(k)}" ${c.wasteReason===k?"selected":""}>${g(k)}</option>`).join("")}
            </select>
          </div>
        </div>
      `}).join("")),window.lucide&&window.lucide.createIcons()}function nn(t,n){let o=(window.gFnbWasteStockItems||[]).find(d=>d.code===t);if(!o)return;let e=parseFloat(n),a=Number(o.book_qty)||0;isNaN(e)||e<0?o.wasteQty=0:e>a?(o.wasteQty=a,typeof window.showToast=="function"&&window.showToast(`S\u1ED1 l\u01B0\u1EE3ng h\u1EE7y kh\xF4ng \u0111\u01B0\u1EE3c v\u01B0\u1EE3t qu\xE1 t\u1ED3n s\xE1ch (${a})`)):o.wasteQty=e;let i=o.wasteQty*(Number(o.unit_price)||0),r=document.getElementById(`wasteLineTotal_${t}`);r&&(r.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB");let s=document.getElementById(`mobWasteLineTotal_${t}`);s&&(s.textContent=i>0?Math.round(i).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),St()}function on(t,n){let o=(window.gFnbWasteStockItems||[]).find(e=>e.code===t);o&&(o.wasteReason=n)}function an(t,n){let o=(window.gFnbWasteStockItems||[]).find(e=>e.code===t);o&&(o.wasteNote=n)}function St(){let t=window.gFnbWasteStockItems||[],n=0,o=0;t.forEach(s=>{s.wasteQty>0&&(n++,o+=s.wasteQty*(Number(s.unit_price)||0))});let e=document.getElementById("kpiWasteSelectedCount");e&&(e.textContent=String(n));let a=document.getElementById("kpiWasteTotalEstAmount");if(a)if(o>0){let s=qt(o);a.innerHTML=`${s.val}<span class="kpi-unit">${s.unit}</span>`}else a.textContent="0 \u20AB";let i=document.getElementById("btnSubmitDirectWaste"),r=document.getElementById("btnSubmitDirectWasteText");i&&(i.disabled=n===0),r&&(r.textContent=`X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (${n})`)}async function rn(){let n=(window.gFnbWasteStockItems||[]).filter(d=>(d.wasteQty||0)>0);if(!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0 cho \xEDt nh\u1EA5t m\u1ED9t m\u1EB7t h\xE0ng!");return}let o=O(),e=new Date().toISOString().slice(0,10),a=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp Tr\u01B0\u1EDFng / Qu\u1EA3n L\xFD",i=0;n.forEach(d=>{i+=d.wasteQty*(Number(d.unit_price)||0)});let r={site_code:o,waste_date:e,reason:n.length===1?n[0].wasteReason:"H\xE0ng h\u1ECFng / hao h\u1EE5t \u0111\u1ECBnh k\u1EF3 \u0111i\u1EC3m b\xE1n",confirmed_by:a,notes:`Bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng g\u1ED3m ${n.length} m\u1EB7t h\xE0ng t\u1ED3n kho`,created_by:a,lines:n.map(d=>({item_code:d.code,qty:d.wasteQty,unit_price:Number(d.unit_price)||0,reason_detail:d.wasteReason||"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",note:d.wasteNote||""}))},s=document.getElementById("btnSubmitDirectWaste");s&&(s.disabled=!0,s.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u bi\xEAn b\u1EA3n h\u1EE7y v\xE0 c\u1EADp nh\u1EADt s\u1ED1 d\u01B0 t\u1ED3n...");let l=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(r)})).json();if(!l.success)throw new Error(l.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y h\xE0ng");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${l.data.waste_code}! T\u1ED3n kho \u0111i\u1EC3m ${o} \u0111\xE3 \u0111\u01B0\u1EE3c gi\u1EA3m t\u1EF1 \u0111\u1ED9ng.`),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),at("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(d){console.error("submitDirectWaste error:",d),typeof window.showToast=="function"&&window.showToast("L\u1ED7i ghi bi\xEAn b\u1EA3n h\u1EE7y: "+d.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),s&&(s.disabled=!1,s.innerHTML='<i data-lucide="trash-2" class="w-4 h-4"></i> <span id="btnSubmitDirectWasteText">X\xE1c Nh\u1EADn T\u1EA1o Bi\xEAn B\u1EA3n H\u1EE7y (0)</span>'),window.lucide&&window.lucide.createIcons()}}async function sn(){let t=document.getElementById("createWasteModal"),n=O(),o=document.getElementById("wasteModalSite"),e=document.getElementById("wasteModalDate");if(e&&!e.value&&(e.value=new Date().toISOString().slice(0,10)),o){let i="";(typeof window.gFnbSitesList<"u"?window.gFnbSitesList:[]).forEach(r=>{i+=`<option value="${r.code}" ${r.code===n?"selected":""}>${r.ten||r.name}</option>`}),o.innerHTML=i,o.value=n}await Ct(n);let a=document.getElementById("wasteLinesContainer");a&&(a.innerHTML=""),Et(),t&&t.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}function ne(){let t=document.getElementById("createWasteModal");t&&t.classList.add("hidden")}async function dn(){let t=document.getElementById("wasteModalSite")?.value||"K001";await Ct(t);let n=document.getElementById("wasteLinesContainer");n&&(n.innerHTML=""),Et()}async function Ct(t){try{let o=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();window.gWasteModalInStockItems=o.success&&o.data?o.data.items||[]:[]}catch{window.gWasteModalInStockItems=[]}}function Et(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let n=window.gWasteModalInStockItems||[],o="wasteRow_"+Date.now()+"_"+Math.floor(Math.random()*1e3),e='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng c\xF3 t\u1ED3n kho --</option>';n.forEach(i=>{e+=`<option value="${g(i.code)}" data-price="${i.unit_price}" data-unit="${g(i.unit||"")}" data-stock="${i.book_qty}">[${g(i.code)}] ${g(i.name)} (T\u1ED3n: ${Number(i.book_qty).toFixed(1)} ${g(i.unit||"")})</option>`});let a=`
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
  `;t.insertAdjacentHTML("beforeend",a),window.lucide&&window.lucide.createIcons()}function ln(t,n){let o=document.getElementById(t);if(!o)return;let e=n.options[n.selectedIndex],a=Number(e?.getAttribute("data-price"))||0,i=Number(e?.getAttribute("data-stock"))||0,r=o.querySelector(".waste-modal-price");r&&(r.textContent=Math.round(a).toLocaleString("vi-VN")+" \u20AB");let s=o.querySelector(".waste-modal-qty");s&&(s.max=String(i),s.placeholder=`T\u1ED1i \u0111a ${i.toFixed(1)}`),oe(t,s?s.value:"0")}function oe(t,n){let o=document.getElementById(t);if(!o)return;let e=o.querySelector("select"),a=e?.options[e.selectedIndex],i=Number(a?.getAttribute("data-price"))||0,s=(parseFloat(n)||0)*i,d=o.querySelector(".waste-modal-amt");d&&(d.textContent=s>0?Math.round(s).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB"),ae()}function ae(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let n=0;t.querySelectorAll(".p-3").forEach(e=>{let a=e.querySelector("select"),i=a?.options[a.selectedIndex],r=Number(i?.getAttribute("data-price"))||0,s=e.querySelector(".waste-modal-qty"),d=parseFloat(s?.value||"0")||0;n+=d*r});let o=document.getElementById("wasteModalTotalAmount");o&&(o.textContent=n>0?Math.round(n).toLocaleString("vi-VN")+" \u20AB":"0 \u20AB")}async function cn(){let t=document.getElementById("wasteLinesContainer");if(!t)return;let n=[];if(t.querySelectorAll(".p-3").forEach(u=>{let p=u.querySelector("select"),m=p?.value,b=p?.options[p.selectedIndex],h=Number(b?.getAttribute("data-price"))||0,c=u.querySelector(".waste-modal-qty"),y=parseFloat(c?.value||"0")||0;m&&y>0&&n.push({item_code:m,qty:y,unit_price:h,reason_detail:document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",note:""})}),!n.length){typeof window.showToast=="function"&&window.showToast("Vui l\xF2ng ch\u1ECDn m\u1EB7t h\xE0ng v\xE0 nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng h\u1EE7y > 0!");return}let o=document.getElementById("wasteModalSite")?.value||O(),e=document.getElementById("wasteModalDate")?.value||new Date().toISOString().slice(0,10),a=document.getElementById("wasteModalReason")?.value||"H\xE0ng h\u1ECFng / r\xE1ch",i=document.getElementById("wasteModalConfirmedBy")?.value||"B\u1EBFp tr\u01B0\u1EDFng",r=document.getElementById("wasteModalNotes")?.value||"",s=window.gCurrentUser&&window.gCurrentUser.name||"B\u1EBFp tr\u01B0\u1EDFng",d={site_code:o,waste_date:e,reason:a,confirmed_by:i,notes:r,created_by:s,lines:n},l=document.getElementById("btnSubmitWaste");l&&(l.disabled=!0,l.innerHTML='<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> \u0110ang x\xE1c nh\u1EADn...');try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang t\u1EA1o bi\xEAn b\u1EA3n h\u1EE7y...");let p=await(await fetch("/api/fnb/wastes",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)})).json();if(!p.success)throw new Error(p.error||"L\u1ED7i khi t\u1EA1o bi\xEAn b\u1EA3n");typeof window.showToast=="function"&&window.showToast(`T\u1EA1o th\xE0nh c\xF4ng bi\xEAn b\u1EA3n h\u1EE7y ${p.data.waste_code}!`),ne(),typeof window.loadFnbWaste=="function"&&await window.loadFnbWaste(),at("history"),typeof window.loadFnbStock=="function"&&window.loadFnbStock(),typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}catch(u){console.error("submitCreateWaste error:",u),typeof window.showToast=="function"&&window.showToast("L\u1ED7i: "+u.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading(),l&&(l.disabled=!1,l.innerHTML='<i data-lucide="check" class="w-4 h-4"></i> X\xE1c Nh\u1EADn H\u1EE7y H\xE0ng'),window.lucide&&window.lucide.createIcons()}}async function xo(){Zt();let t=O(),n=document.getElementById("fnbWasteFilterSite");n&&n.value!==t&&(n.value=t);let o=document.getElementById("fnbWasteSummary");o&&(o.textContent="\u0110ang t\u1EA3i h\xE0ng t\u1ED3n c\u1EE7a "+t+"...");try{let a=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&in_stock_only=1&no-cache=1`)).json();a.success&&a.data?window.gFnbWasteStockItems=(a.data.items||[]).map(i=>({...i,wasteQty:0,wasteReason:"H\xE0ng h\u1ECFng / \xF4i thiu kh\xF4ng \u0111\u1EA1t chu\u1EA9n",wasteNote:""})):window.gFnbWasteStockItems=[],ee(),rt(),te(t)}catch(e){console.error("loadFnbWaste error:",e),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u h\u1EE7y h\xE0ng: "+e.message)}}var L=window;L.gFnbWasteStockItems=L.gFnbWasteStockItems||[];L.gFnbWasteNganhMap=L.gFnbWasteNganhMap||null;L.gWasteModalInStockItems=L.gWasteModalInStockItems||[];L.getActiveFnbWasteSite=O;L.populateFnbWasteSiteDropdown=Zt;L.loadFnbWaste=xo;L.switchFnbWasteSubView=at;L.populateFnbWasteFilters=ee;L.populateFnbWasteNhomHangDropdown=Lt;L.onFnbWasteNganhHangChange=Ye;L.onFnbWasteFilterChange=Ze;L.onFnbWasteSearch=tn;L.onFnbWasteSiteChange=en;L.renderFnbWasteStockTable=rt;L.onWasteLineQtyChange=nn;L.onWasteLineReasonChange=on;L.onWasteLineNoteChange=an;L.updateWasteKPIs=St;L.submitDirectWaste=rn;L.loadFnbWasteHistory=te;L.viewWasteDetail=ze;L.openCreateWasteModal=sn;L.closeCreateWasteModal=ne;L.onWasteModalSiteChange=dn;L.loadWasteModalItems=Ct;L.addWasteLineRow=Et;L.onWasteModalItemSelect=ln;L.onWasteModalLineQtyInput=oe;L.recalculateWasteModalTotal=ae;L.submitCreateWaste=cn;function W(){let t=localStorage.getItem("orbit_user_site"),n=document.getElementById("globalBranchSelect")?.value,o=window,e=typeof o.App<"u"&&o.App.currentBranch?o.App.currentBranch.toUpperCase():null,a=document.getElementById("fnbCountSiteSelect")?.value,i=t||n||e||a||"K001";return(i==="ALL"||i==="all")&&(i="K001"),i.toUpperCase()}function Tt(){let t=document.getElementById("fnbCountNganhHangFilter"),n=document.getElementById("fnbCountNhomHangFilter");if(!t||!n)return;let o=new Map;(window.gFnbAllItems||[]).forEach(i=>{let r=(i.nganh_hang||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim(),s=(i.nhom_hang||i.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i").trim();o.has(r)||o.set(r,new Set),o.get(r).add(s)}),window.gFnbNganhMap=o;let a='<option value="">T\u1EA5t c\u1EA3 ng\xE0nh h\xE0ng</option>';Array.from(o.keys()).sort().forEach(i=>{a+=`<option value="${g(i)}">${g(i)}</option>`}),t.innerHTML=a,t.value="",It("")}function It(t){let n=document.getElementById("fnbCountNhomHangFilter");if(!n)return;let o=new Set;window.gFnbNganhMap&&(t&&window.gFnbNganhMap.has(t)?window.gFnbNganhMap.get(t).forEach(a=>o.add(a)):window.gFnbNganhMap.forEach(a=>a.forEach(i=>o.add(i))));let e='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>';Array.from(o).sort().forEach(a=>{e+=`<option value="${g(a)}">${g(a)}</option>`}),n.innerHTML=e,n.value=""}function un(){let t=document.getElementById("fnbCountNganhHangFilter")?.value||"";It(t),P()}function gn(){P()}function pn(t){P()}function mn(){P()}function fn(){let t=document.getElementById("fnbCountSiteSelect");if(t&&t.value&&t.value!=="all"){try{localStorage.setItem("orbit_user_site",t.value)}catch{}let n=document.getElementById("globalBranchSelect");n&&(n.value=t.value)}typeof window.loadFnbCounts=="function"&&window.loadFnbCounts()}function bn(t){window.gFnbBlindCount=t,P()}function hn(t,n){let o=(window.gCurrentCountItems||[]).find(e=>e.code===t);o&&(o.userCount=n===""?0:Number(n),P())}function yn(t,n){let o=(window.gCurrentCountItems||[]).find(e=>e.code===t);o&&(o.userNote=n)}function P(){let t=document.getElementById("fnbCountsTableBody"),n=document.getElementById("fnbCountsMobileCards"),o=(document.getElementById("fnbCountNganhHangFilter")?.value||"").trim().toLowerCase(),e=(document.getElementById("fnbCountNhomHangFilter")?.value||"").trim().toLowerCase(),a=document.getElementById("fnbCountStatusFilter")?.value||"all",i=(document.getElementById("fnbCountSearchInput")?.value||"").trim().toLowerCase(),r=window.gFnbAllItems||[],s=r.filter(c=>{if(o&&(c.nganh_hang||"").trim().toLowerCase()!==o||e&&(c.nhom_hang||c.item_group||"").trim().toLowerCase()!==e)return!1;if(a!=="all"){let y=Number(c.book_qty)||0,x=(c.userCount!==void 0?Number(c.userCount):c.last_count_qty!==null&&c.last_count_qty!==void 0?Number(c.last_count_qty):y)-y,v=c.userCount!==void 0||c.last_count_qty!==null;if(a==="diff"&&Math.abs(x)<.001||a==="matched"&&Math.abs(x)>=.001||a==="counted"&&!v||a==="uncounted"&&v)return!1}if(i){let y=(c.name||"").toLowerCase(),f=(c.code||"").toLowerCase(),x=(c.nganh_hang||"").toLowerCase(),v=(c.nhom_hang||"").toLowerCase();if(!y.includes(i)&&!f.includes(i)&&!x.includes(i)&&!v.includes(i))return!1}return!0});window.gCurrentCountItems=s;let d=0,l=0,u=0;s.forEach(c=>{let y=Number(c.book_qty)||0,f=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:y,v=(Number(f)||0)-y,k=v*(Number(c.unit_price)||0);Math.abs(v)<.001?d++:l++,u+=k});let p=document.getElementById("fnbCountMetricTotal");p&&(p.textContent=String(s.length));let m=document.getElementById("fnbCountMetricMatched");m&&(m.textContent=String(d));let b=document.getElementById("fnbCountMetricDiff");b&&(b.textContent=String(l));let h=document.getElementById("fnbCountMetricDiffVal");h&&(h.textContent=(u>0?"+":"")+Math.round(u).toLocaleString("vi-VN")+" \u0111"),t&&(s.length===0?!r||r.length===0?t.innerHTML=`<tr><td colspan="8" class="text-center py-12 text-gray-500 dark:text-gray-400">
          <div class="flex flex-col items-center justify-center gap-2">
            <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
            <p class="font-semibold text-sm text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
            <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium hover:text-brand-600">Nh\u1EADp H\xE0ng \u0110i\u1EC3m B\xE1n</a> tr\u01B0\u1EDBc khi th\u1EF1c hi\u1EC7n ki\u1EC3m k\xEA.</p>
          </div>
        </td></tr>`:t.innerHTML='<tr><td colspan="8" class="text-center py-10 text-gray-400">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc hi\u1EC7n t\u1EA1i.</td></tr>':t.innerHTML=s.map((c,y)=>{let f=Number(c.book_qty)||0,x=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:f,v=Number(x)||0,k=v-f,I=k*(Number(c.unit_price)||0),T='<span class="text-gray-400 tabular-nums">0</span>';k>0?T=`<span class="text-emerald-600 dark:text-emerald-400 font-semibold tabular-nums font-mono">+${k.toFixed(1)}</span>`:k<0&&(T=`<span class="text-rose-600 dark:text-rose-400 font-semibold tabular-nums font-mono">${k.toFixed(1)}</span>`);let R='<span class="text-gray-400 tabular-nums font-mono">0 \u0111</span>';I>0?R=`<span class="text-emerald-600 dark:text-emerald-400 font-bold tabular-nums font-mono">+${Math.round(I).toLocaleString("vi-VN")} \u0111</span>`:I<0&&(R=`<span class="text-rose-600 dark:text-rose-400 font-bold tabular-nums font-mono">${Math.round(I).toLocaleString("vi-VN")} \u0111</span>`);let xt=window.gFnbBlindCount?'<span class="text-gray-300 dark:text-gray-700 italic tabular-nums text-xs select-none">\u2022\u2022\u2022\u2022</span>':`<span class="font-bold tabular-nums font-mono ${f<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${f.toFixed(1)}</span>`,tt=c.nhom_hang||c.item_group||"";return`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${y+1}</td>
            <td class="py-3 px-4">
              <div class="font-bold text-gray-900 dark:text-white">${g(c.name)}</div>
              <div class="text-xs tabular-nums text-gray-400 flex items-center gap-1.5 mt-0.5">
                <span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${g(c.code)}</span>
                ${tt?`<span>\u2022</span><span class="text-gray-500 dark:text-gray-400">${g(tt)}</span>`:""}
                <span>\u2022</span>
                <span class="font-mono">Gi\xE1: ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-semibold text-gray-600 dark:text-gray-300 text-xs">${g(c.unit||"")}</td>
            <td class="py-3 px-3 text-right fnb-count-book-col">${xt}</td>
            <td class="py-2.5 px-3 bg-blue-50/30 dark:bg-blue-950/10">
              <input type="number" step="0.1" value="${v}" oninput="onCountInputChange('${g(c.code)}', this.value)"
                     class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-white/3 font-semibold tabular-nums text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 font-mono">
            </td>
            <td class="py-3 px-3 text-right select-all">${T}</td>
            <td class="py-3 px-3 text-right select-all">${R}</td>
            <td class="py-2.5 px-4">
              <input type="text" placeholder="L\xFD do ch\xEAnh l\u1EC7ch (n\u1EBFu c\xF3)..." value="${g(c.userNote||"")}" oninput="onCountNoteChange('${g(c.code)}', this.value)"
                     class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none focus:border-blue-500">
            </td>
          </tr>
        `}).join("")),n&&(s.length===0?!r||r.length===0?n.innerHTML=`<div class="text-center py-8 px-4 text-gray-500 dark:text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col items-center justify-center gap-2">
          <i data-lucide="package-search" class="w-8 h-8 text-gray-400"></i>
          <p class="font-semibold text-xs text-gray-700 dark:text-gray-200">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u01B0\u1EE3c nh\u1EADp kho t\u1EA1i \u0111i\u1EC3m b\xE1n n\xE0y.</p>
          <p class="text-xs text-gray-400">Vui l\xF2ng nh\u1EADp h\xE0ng t\u1EA1i tab <a href="javascript:void(0)" onclick="switchTab('fnb-receipts')" class="text-brand-500 underline font-medium">Nh\u1EADp H\xE0ng</a> tr\u01B0\u1EDBc khi ki\u1EC3m k\xEA.</p>
        </div>`:n.innerHTML='<div class="text-center py-8 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':n.innerHTML=s.map(c=>{let y=Number(c.book_qty)||0,f=c.userCount!==void 0?c.userCount:c.last_count_qty!==null&&c.last_count_qty!==void 0?c.last_count_qty:y,x=Number(f)||0,v=x-y,k=v*(Number(c.unit_price)||0);return`
          <div class="data-card bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div>
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">${g(c.nhom_hang||c.item_group||"Ch\u01B0a ph\xE2n lo\u1EA1i")}</span>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1">${g(c.name)}</h4>
                <div class="text-xs text-gray-400 tabular-nums"><span class="font-mono text-brand-600 dark:text-brand-400 font-semibold">${g(c.code)}</span> \u2022 ${Number(c.unit_price).toLocaleString("vi-VN")} \u0111/${g(c.unit||"")}</div>
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400">T\u1ED3n s\xE1ch:</span>
                <div class="font-bold tabular-nums text-xs font-mono ${y<0?"text-rose-600":"text-gray-800 dark:text-gray-200"}">${window.gFnbBlindCount?"\u2022\u2022\u2022\u2022":y.toFixed(1)} ${g(c.unit||"")}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div>
                <span class="text-xs text-gray-400 block mb-0.5">SL Th\u1EF1c t\u1EBF:</span>
                <input type="number" step="0.1" value="${x}" oninput="onCountInputChange('${g(c.code)}', this.value)"
                       class="w-full text-center py-1.5 px-2 rounded-xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/20 font-bold tabular-nums text-gray-900 dark:text-white outline-none font-mono">
              </div>
              <div class="text-right">
                <span class="text-xs text-gray-400 block mb-0.5">Ch\xEAnh l\u1EC7ch:</span>
                <div class="font-bold text-xs pt-1.5 tabular-nums font-mono ${v>0?"text-emerald-600":v<0?"text-rose-600":"text-gray-400"}">
                  ${v>0?"+":""}${v.toFixed(1)} (${(k>0?"+":"")+Math.round(k).toLocaleString("vi-VN")} \u0111)
                </div>
              </div>
            </div>

            <input type="text" placeholder="Ghi ch\xFA l\xFD do..." value="${g(c.userNote||"")}" oninput="onCountNoteChange('${g(c.code)}', this.value)"
                   class="w-full py-1 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-xs outline-none">
          </div>
        `}).join("")),window.lucide&&window.lucide.createIcons()}async function xn(){let t=W(),n=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),o="DAILY",e=window.gCurrentCountItems||[];if(!e||!e.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o \u0111\u1EC3 l\u01B0u ki\u1EC3m k\xEA!");return}let a=e.map(r=>{let s=Number(r.book_qty)||0,d=r.userCount!==void 0?Number(r.userCount):r.last_count_qty!==null&&r.last_count_qty!==void 0?Number(r.last_count_qty):s,l=d-s,u=l*(Number(r.unit_price)||0);return{item_code:r.code,item_name:r.name,item_group:r.item_group||r.nhom_hang||"NVL",unit:r.unit,unit_price:Number(r.unit_price)||0,book_qty:s,actual_qty:d,count_qty:d,diff_qty:l,diff_value:u,diff_val:u,note:r.userNote||""}}),i={site_code:t,count_date:n,count_type:o,notes:`Ki\u1EC3m k\xEA h\u1EB1ng ng\xE0y \u0111i\u1EC3m ${t}`,lines:a};try{typeof window.showLoading=="function"&&window.showLoading("\u0110ang l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA...");let s=await(await fetch("/api/fnb/counts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(i)})).json();if(!s.success)throw new Error(s.error||"L\u1ED7i khi l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA");typeof window.showToast=="function"&&window.showToast(`\u0110\xE3 l\u01B0u phi\u1EBFu ki\u1EC3m k\xEA ${s.data.count_code} th\xE0nh c\xF4ng!`),typeof window.loadFnbCounts=="function"&&await window.loadFnbCounts()}catch(r){console.error("saveFnbCountAudit error:",r),typeof window.showToast=="function"&&window.showToast("L\u1ED7i l\u01B0u ki\u1EC3m k\xEA: "+r.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}async function re(t){let n=t||W();try{let e=await(await fetch(`/api/fnb/counts?site_code=${encodeURIComponent(n)}`)).json(),a=document.getElementById("fnbCountsHistoryBody"),i=document.getElementById("fnbCountsHistoryMobileCards");if((a||i)&&e.success){let r=e.data.counts||[];r.length?(a&&(a.innerHTML=r.map(s=>`
            <tr class="hover:bg-gray-50 dark:hover:bg-gray-800/40">
              <td class="py-2.5 px-3 tabular-nums font-bold text-blue-600 dark:text-blue-400 cursor-pointer font-mono" onclick="viewCountDetail(${s.id})">${g(s.count_code)}</td>
              <td class="py-2.5 px-3 font-semibold">${g(s.site_code)}</td>
              <td class="py-2.5 px-3 tabular-nums">${g(s.count_date)}</td>
              <td class="py-2.5 px-3"><span class="px-2 py-0.5 rounded font-bold text-xs ${s.count_type==="DAILY"?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"}">${s.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span></td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono">${s.total_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-mono ${s.diff_items>0?"text-rose-600 font-bold":"text-emerald-600"}">${s.diff_items}</td>
              <td class="py-2.5 px-3 text-right tabular-nums font-bold font-mono ${s.diff_value>0||s.diff_value<0?"text-rose-600":"text-emerald-600"}">${Math.round(s.diff_value).toLocaleString("vi-VN")} \u0111</td>
              <td class="py-2.5 px-3 text-gray-400">${g(s.notes||"\u2014")}</td>
            </tr>
          `).join("")),i&&(i.innerHTML=r.map(s=>`
            <div class="data-card cursor-pointer p-4 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-white/3 space-y-2" onclick="viewCountDetail(${s.id})">
              <div class="data-card-header flex items-center justify-between">
                <span class="code font-semibold text-brand-600 dark:text-brand-400 font-mono text-xs">${g(s.count_code)}</span>
                <span class="badge ${s.count_type==="DAILY"?"bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300":"bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300"} text-xs px-2 py-0.5 rounded-full font-bold">${s.count_type==="DAILY"?"H\u1EB1ng Ng\xE0y":"\u0110\u1ECBnh K\u1EF3"}</span>
              </div>
              <div class="data-card-body space-y-1.5">
                <div class="flex justify-between items-center text-xs">
                  <span class="text-gray-400">\u0110i\u1EC3m b\xE1n: <b class="text-gray-700 dark:text-gray-200">${g(s.site_code)}</b></span>
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
          `).join(""))):(a&&(a.innerHTML=`<tr><td colspan="8" class="text-center py-6 text-gray-400">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${g(n)}.</td></tr>`),i&&(i.innerHTML=`<div class="card p-6 text-center text-gray-400 text-sm">Ch\u01B0a c\xF3 phi\u1EBFu ki\u1EC3m k\xEA n\xE0o cho \u0111i\u1EC3m ${g(n)}.</div>`))}}catch(o){console.error("loadFnbCountsHistory error:",o)}}async function wn(t){try{typeof window.showLoading=="function"&&window.showLoading();let o=await(await fetch(`/api/fnb/counts?id=${t}`)).json();if(!o.success)throw new Error("Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c phi\u1EBFu");let e=o.data.lines||[],a=document.getElementById("invDetailModal"),i=document.getElementById("invDetailModalTitle"),r=document.getElementById("invDetailModalSub");i&&(i.textContent=`Chi Ti\u1EBFt Phi\u1EBFu Ki\u1EC3m K\xEA #${t}`),r&&(r.textContent=`${e.length} m\u1EB7t h\xE0ng ki\u1EC3m k\xEA`);let s=`
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
            ${e.map(l=>`
              <tr>
                <td class="py-2 px-3 font-sans font-bold text-gray-900 dark:text-white">${g(l.item_name||l.item_code)}</td>
                <td class="py-2 px-3 text-right font-mono">${l.book_qty}</td>
                <td class="py-2 px-3 text-right font-bold text-blue-600 font-mono">${l.count_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${l.diff_qty<0?"text-rose-600":l.diff_qty>0?"text-emerald-600":"text-gray-400"}">${l.diff_qty>0?"+":""}${l.diff_qty}</td>
                <td class="py-2 px-3 text-right font-semibold font-mono ${l.diff_val<0?"text-rose-600":l.diff_val>0?"text-emerald-600":"text-gray-400"}">${l.diff_val>0?"+":""}${Math.round(l.diff_val).toLocaleString("vi-VN")} \u0111</td>
                <td class="py-2 px-3 font-sans text-gray-500 text-xs">${g(l.note||"--")}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    `,d=document.getElementById("invDetailModalBody");d&&(d.innerHTML=s),a&&a.classList.remove("hidden"),window.lucide&&window.lucide.createIcons()}catch(n){typeof window.showToast=="function"&&window.showToast("L\u1ED7i xem chi ti\u1EBFt: "+n.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}function vn(){document.getElementById("invDetailModal")?.classList.add("hidden")}function kn(){let t=window.gCurrentCountItems||[];if(!t||!t.length){typeof window.showToast=="function"&&window.showToast("Kh\xF4ng c\xF3 d\u1EEF li\u1EC7u m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t phi\u1EBFu ki\u1EC3m!");return}let n=W(),o=document.getElementById("fnbCountDatePicker")?.value||new Date().toISOString().slice(0,10),a=[["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Ng\xE0nh H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)","T\u1ED3n S\u1ED5 S\xE1ch","S\u1ED1 \u0110\u1EBFm Th\u1EF1c T\u1EBF","Ch\xEAnh L\u1EC7ch","Ghi Ch\xFA"]];if(t.forEach((d,l)=>{let u=Number(d.book_qty)||0,p=d.userCount!==void 0?Number(d.userCount):d.last_count_qty!==null&&d.last_count_qty!==void 0?Number(d.last_count_qty):u,m=p-u;a.push([l+1,d.code,d.name,d.nganh_hang||"",d.nhom_hang||d.item_group||"",d.unit,Number(d.unit_price)||0,u,p,m,d.userNote||""])}),typeof XLSX>"u"){typeof window.showToast=="function"&&window.showToast("Th\u01B0 vi\u1EC7n XLSX ch\u01B0a s\u1EB5n s\xE0ng!");return}let i=XLSX.utils.aoa_to_sheet(a);i["!cols"]=[{wch:6},{wch:15},{wch:32},{wch:20},{wch:22},{wch:8},{wch:14},{wch:14},{wch:16},{wch:14},{wch:25}],i["!autofilter"]={ref:`A1:K${a.length}`},i["!views"]=[{state:"frozen",ySplit:1,xSplit:0}];let r=XLSX.utils.decode_range(i["!ref"]||"A1:K1");for(let d=r.s.r;d<=r.e.r;++d)for(let l=r.s.c;l<=r.e.c;++l){let u=XLSX.utils.encode_cell({r:d,c:l});if(i[u])if(d===0)i[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{vertical:"center",horizontal:l===0||l===1?"center":l>=6&&l<=9?"right":"left",wrapText:!1}};else{let p=l===0||l>=6&&l<=9,m=l===1||l===5;i[u].s={font:{name:"Aptos",sz:11,regular:!0,color:{rgb:"000000"}},alignment:{vertical:"center",horizontal:p?"right":m?"center":"left"}}}}let s=XLSX.utils.book_new();XLSX.utils.book_append_sheet(s,i,"PhieuKiemKe"),XLSX.writeFile(s,`Phieu_Kiem_Ke_${n}_${o}.xlsx`),typeof window.showToast=="function"&&window.showToast("\u0110\xE3 xu\u1EA5t phi\u1EBFu ki\u1EC3m k\xEA Excel theo quy chu\u1EA9n Aptos!")}async function wo(){let t=W(),n=document.getElementById("fnbCountSiteSelect");n&&n.value!==t&&(n.value=t);let e=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(s=>s.code.toUpperCase()===t.toUpperCase()),a=e?e.ten||e.name:t,i=document.getElementById("fnbCountCurrentSiteBadge");i&&(i.textContent=a);let r=document.getElementById("fnbCountDatePicker");r&&!r.value&&(r.value=new Date().toISOString().slice(0,10));try{typeof window.showLoading=="function"&&window.showLoading("T\u1EA3i danh m\u1EE5c ki\u1EC3m k\xEA c\u1EE7a "+t+"...");let d=await(await fetch(`/api/fnb/stock/items-for-site?site_code=${encodeURIComponent(t)}&no-cache=1`)).json();d.success&&d.data?(window.gFnbAllItems=d.data.items||[],Tt(),P()):(window.gFnbAllItems=[],Tt(),P()),re(t)}catch(s){console.error("loadFnbCounts error:",s),typeof window.showToast=="function"&&window.showToast("L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u ki\u1EC3m k\xEA: "+s.message)}finally{typeof window.hideLoading=="function"&&window.hideLoading()}}var C=window;C.gFnbAllItems=C.gFnbAllItems||[];C.gCurrentCountItems=C.gCurrentCountItems||[];C.gFnbBlindCount=C.gFnbBlindCount||!1;C.gFnbNganhMap=C.gFnbNganhMap||null;C.getActiveFnbCountSite=W;C.loadFnbCounts=wo;C.populateFnbCountFilters=Tt;C.populateFnbCountNhomHangDropdown=It;C.onFnbCountNganhHangChange=un;C.onFnbCountFilterChange=gn;C.onFnbCountSearch=pn;C.onFnbCountDateChange=mn;C.onFnbCountSiteChange=fn;C.toggleBlindCount=bn;C.onCountInputChange=hn;C.onCountNoteChange=yn;C.renderFnbCountsTable=P;C.saveFnbCountAudit=xn;C.loadFnbCountsHistory=re;C.viewCountDetail=wn;C.closeInvDetailModal=vn;C.exportCountSheetExcel=kn;function Mt(t){if(!t||!t.rows||t.rows.length===0){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}try{let n=t.sites||[],o=t.rows||[],e=t.groups||{},a=["STT","M\xE3 H\xE0ng","T\xEAn H\xE0ng","Nh\xF3m H\xE0ng","\u0110VT","\u0110\u01A1n Gi\xE1 (\u0111)"];n.forEach(p=>{a.push(p.ten||p.name||p.code)});let i=[a];o.forEach((p,m)=>{let b=e[p.group]||p.group,h=[m+1,p.code,p.name,b,p.unit,p.price||0];n.forEach(c=>{let y=p.cells?p.cells[c.id]:void 0;h.push(y&&y.book||0)}),i.push(h)});let r=XLSX.utils.aoa_to_sheet(i),s=XLSX.utils.decode_range(r["!ref"]),d=[{wch:6},{wch:14},{wch:32},{wch:18},{wch:8},{wch:14}];n.forEach(()=>d.push({wch:16})),r["!cols"]=d;for(let p=s.s.r;p<=s.e.r;++p)for(let m=s.s.c;m<=s.e.c;++m){let b=XLSX.utils.encode_cell({r:p,c:m});if(!r[b])continue;if(p===0)r[b].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"CCCCCC"}},bottom:{style:"medium",color:{rgb:"000000"}},left:{style:"thin",color:{rgb:"CCCCCC"}},right:{style:"thin",color:{rgb:"CCCCCC"}}}};else{let c="left",y;m===0||m===1||m===4?c="center":(m===5||m>=6)&&(c="right",y="#,##0.00");let f=m>=6&&typeof r[b].v=="number"&&r[b].v<0;r[b].s={font:{name:"Aptos",sz:11,bold:f,color:{rgb:f?"C00000":"000000"}},alignment:{horizontal:c,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E5E5E5"}},bottom:{style:"thin",color:{rgb:"E5E5E5"}},left:{style:"thin",color:{rgb:"E5E5E5"}},right:{style:"thin",color:{rgb:"E5E5E5"}}}},y&&typeof r[b].v=="number"&&(r[b].z=y)}}r["!autofilter"]={ref:r["!ref"]},r["!freeze"]={xSplit:3,ySplit:1,topLeftCell:"D2",activePane:"bottomRight",state:"frozen"};let l=XLSX.utils.book_new();XLSX.utils.book_append_sheet(l,r,"T\u1ED3n Kho Chu\u1ED7i F&B");let u=new Date().toISOString().slice(0,10).replace(/-/g,"");XLSX.writeFile(l,`Ton_Kho_F&B_Chuoi_${u}.xlsx`),typeof showToast=="function"&&showToast("Xu\u1EA5t b\xE1o c\xE1o t\u1ED3n kho F&B th\xE0nh c\xF4ng (Font Aptos)!")}catch(n){console.error("Export Excel error:",n),typeof showToast=="function"&&showToast("L\u1ED7i xu\u1EA5t Excel: "+(n?.message||n))}}var j=null,$={site:"ALL",group:"ALL",search:"",showValue:!1},$t="";async function se(){try{typeof showLoading=="function"&&showLoading();let t=new URL("/api/fnb/stock",window.location.origin);$.site&&$.site!=="ALL"&&$.site!=="all"&&t.searchParams.set("site_code",$.site),$.region&&$.region!=="ALL"&&t.searchParams.set("regionId",$.region),$.group&&$.group!=="ALL"&&t.searchParams.set("group",$.group),t.searchParams.set("refresh","true");let o=await(await fetch(t.toString())).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c d\u1EEF li\u1EC7u t\u1ED3n kho F&B");j=o.data,window.gFnbStockData=j,ut()}catch(t){console.error("Error loadFnbStock:",t),typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i t\u1ED3n kho F&B: "+(t?.message||t))}finally{typeof hideLoading=="function"&&hideLoading()}}function ut(){if(!j)return;let t=j.sites||[],n=j.rows||[],o=j.groups||{},e=($t||"").trim().toLowerCase(),a=n.filter(f=>{if(!e)return!0;let x=(f.name||"").toLowerCase().includes(e),v=(f.code||"").toLowerCase().includes(e);return x||v}),i=$.site,r=a;i&&i!=="ALL"&&i!=="all"&&(r=a.filter(f=>{let x=f.cells&&f.cells[i];return x&&(x.hasSiteRecord||x.book!==void 0&&Number(x.book)!==0||x.lastCount!==null&&x.lastCount!==void 0)}));let s=0,d=0,l=0;a.forEach(f=>{t.forEach(x=>{let v=f.cells&&f.cells[x.id];if(v){let k=Number(v.value)||0,I=Number(v.book)||0;s+=k,I<0&&d++,v.noOpening&&l++}})});let u=document.getElementById("fnbStockKpiTotalItems"),p=document.getElementById("fnbStockKpiTotalValue"),m=document.getElementById("fnbStockKpiNegative"),b=document.getElementById("fnbStockKpiNoOpening");u&&(u.textContent=r.length.toLocaleString("vi-VN")),p&&(p.textContent=Math.round(s).toLocaleString("vi-VN")+" \u0111"),m&&(m.textContent=d.toLocaleString("vi-VN")),b&&(b.textContent=l.toLocaleString("vi-VN"));let h=document.getElementById("fnbStockTableHead");if(h){let f=`
      <tr>
        <th class="py-3 px-3 text-center w-12 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">STT</th>
        <th class="py-3 px-4 text-left font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 sticky left-0 z-20 bg-gray-50 dark:bg-white/3 min-w-[240px] shadow-[2px_0_5px_rgba(0,0,0,0.04)]">M\u1EB7t H\xE0ng F&amp;B</th>
        <th class="py-3 px-3 text-center w-16 font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800">\u0110VT</th>
    `;t.forEach(x=>{let v=x.region==="Mi\u1EC1n Nam";f+=`
        <th class="py-3 px-3 text-right font-bold uppercase tracking-wider text-xs border-b border-gray-200 dark:border-gray-800 min-w-[125px]">
          <div class="flex items-center justify-end gap-1.5">
            <span class="text-xs px-1.5 py-0.2 rounded font-semibold ${v?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${v?"MN":"MB"}</span>
            <span title="${x.name}" class="text-gray-800 dark:text-gray-200">${x.code}</span>
          </div>
          <div class="text-xs font-normal text-gray-400 truncate max-w-[115px]" title="${x.name}">${x.name}</div>
        </th>
      `}),f+="</tr>",h.innerHTML=f}let c=document.getElementById("fnbStockTableBody");c&&(r.length===0?c.innerHTML=`<tr><td colspan="${t.length+3}" class="text-center py-12 text-gray-400">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>`:c.innerHTML=r.map((f,x)=>{let v=o[f.group]||f.group,k=`
          <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
            <td class="py-3 px-3 text-center tabular-nums text-gray-400 text-xs">${x+1}</td>
            <td class="py-3 px-4 sticky left-0 z-10 bg-white dark:bg-white/3 shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
              <div class="flex items-center gap-2">
                <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${v}</span>
                <span class="font-bold text-gray-900 dark:text-white truncate max-w-[180px]">${f.name}</span>
              </div>
              <div class="text-xs tabular-nums text-gray-400 mt-0.5 flex items-center gap-2">
                <span>${f.code}</span>
                <span>\u2022</span>
                <span>Gi\xE1: ${f.price?Number(f.price).toLocaleString("vi-VN")+" \u0111":"--"}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-medium text-gray-600 dark:text-gray-300 text-xs">${f.unit}</td>
        `;return t.forEach(I=>{let T=f.cells&&f.cells[I.id]||{book:0,lastCount:null,noOpening:!0,value:0},R=Number(T.book)||0,tt=R<0?"text-rose-600 dark:text-rose-400 font-semibold":R>0?"text-gray-900 dark:text-white font-bold":"text-gray-400 dark:text-gray-600 font-medium",lt="";if(T.lastCount!==null&&T.lastCount!==void 0&&T.lastCount!==""){let wt=Number(T.lastCount);if(!isNaN(wt)){let Ee=Number.isInteger(wt)?wt.toLocaleString("vi-VN"):wt.toFixed(1);lt=` <span class="text-gray-400 dark:text-gray-500 font-normal text-xs" title="\u0110\u1EBFm g\u1EA7n nh\u1EA5t (${T.lastDate||"N/A"}): ${Ee}">(${Ee})</span>`}}let Y="";T.noOpening&&(Y='<span class="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1" title="Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u"></span>');let Wt="",Ce=Number(T.value)||0;$.showValue&&Ce&&(Wt=`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums mt-0.5">${Math.round(Ce).toLocaleString("vi-VN")} \u0111</div>`);let yo=Number.isInteger(R)?R.toLocaleString("vi-VN"):R.toFixed(1);k+=`
            <td class="py-3 px-3 text-right tabular-nums text-xs select-all">
              <div class="flex items-center justify-end">
                ${Y}
                <span class="${tt}">${yo}</span>${lt}
              </div>
              ${Wt}
            </td>
          `}),k+="</tr>",k}).join(""));let y=document.getElementById("fnbStockMobileCards");y&&(r.length===0?y.innerHTML='<div class="text-center py-10 text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>':y.innerHTML=a.map(f=>{let x=o[f.group]||f.group,v=t.map(k=>{let I=f.cells&&f.cells[k.id]||{book:0,lastCount:null,noOpening:!0,value:0},T=Number(I.book)||0,R=T<0,xt=T===0,tt=Number.isInteger(T)?T.toLocaleString("vi-VN"):T.toFixed(1),lt="";if(I.lastCount!==null&&I.lastCount!==void 0&&I.lastCount!==""){let Y=Number(I.lastCount);isNaN(Y)||(lt=`(${Number.isInteger(Y)?Y.toLocaleString("vi-VN"):Y.toFixed(1)})`)}return{site:k,cell:I,isNeg:R,isZero:xt,bookFormatted:tt,countText:lt}});return`
          <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-3">
            <div class="flex items-start justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-gray-800/80">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 rounded-full font-bold bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${x}</span>
                  <span class="text-xs tabular-nums text-gray-400 font-bold">${f.code}</span>
                </div>
                <h4 class="font-bold text-sm text-gray-900 dark:text-white mt-1 leading-snug">${f.name}</h4>
              </div>
              <div class="text-right shrink-0">
                <span class="px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-semibold tabular-nums">${f.unit}</span>
                <div class="text-xs text-gray-400 tabular-nums mt-1">${f.price?Number(f.price).toLocaleString("vi-VN")+" \u0111":""}</div>
              </div>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              ${v.map(k=>{let I=k.site.region==="Mi\u1EC1n Nam";return`
                  <div class="p-2.5 rounded-xl ${k.isNeg?"bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40":k.isZero?"bg-gray-50 dark:bg-gray-900/40 border border-gray-200/60 dark:border-gray-800/60":"bg-gray-50 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700/60"}">
                    <div class="flex items-center justify-between gap-1 mb-1">
                      <span class="font-bold text-gray-800 dark:text-gray-200 text-xs">${k.site.code}</span>
                      <span class="text-[8.5px] px-1 rounded font-semibold ${I?"bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300":"bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"}">${I?"MN":"MB"}</span>
                    </div>
                    <div class="flex items-baseline justify-between tabular-nums">
                      <span class="text-xs text-gray-400">T\u1ED3n:</span>
                      <span class="${k.isNeg?"text-rose-600 dark:text-rose-400 font-semibold text-sm":k.isZero?"text-gray-400 font-medium":"text-gray-900 dark:text-white font-bold text-sm"}">${k.bookFormatted} <span class="text-xs text-gray-400 font-normal">${k.countText}</span></span>
                    </div>
                    ${k.cell.noOpening?'<div class="text-xs text-amber-500 font-semibold mt-0.5">\u26A0\uFE0F Ch\u01B0a c\xF3 t\u1ED3n \u0111\u1EA7u</div>':""}
                    ${$.showValue&&k.cell.value?`<div class="text-xs text-gray-400 dark:text-gray-500 tabular-nums text-right mt-0.5">${Math.round(k.cell.value).toLocaleString("vi-VN")} \u0111</div>`:""}
                  </div>
                `}).join("")}
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function Ln(){let t=document.getElementById("fnbStockFilterRegion"),n=document.getElementById("fnbStockFilterGroup"),o=document.getElementById("fnbStockFilterSite");o&&($.site=o.value),t&&($.region=t.value),n&&($.group=n.value),se()}function Sn(t){$t=t,ut()}function Cn(t){$.showValue=t,ut()}function Ka(){Mt(j)}var V=window;V.gFnbStockData=j;V.gFnbStockFilter=$;V.gFnbStockSearchTerm=$t;V.loadFnbStock=se;V.renderFnbStock=ut;V.onFnbStockFilterChange=Ln;V.onFnbStockSearch=Sn;V.onFnbStockToggleValue=Cn;V.exportFnbStockExcel=()=>Mt(V.gFnbStockData||j);function ie(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function de(t,n){return typeof window.cellBadge=="function"?window.cellBadge(t,n):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${n}</span>`}function le(t){if(typeof window.escapeHtml=="function")return window.escapeHtml(t);let n=document.createElement("div");return n.textContent=t||"",n.innerHTML}function M(t){return typeof window.fmtVND=="function"?window.fmtVND(t):et(Number(t)||0)}function ce(t){return typeof window.fmtNum=="function"?window.fmtNum(t):B(Number(t)||0)}function q(){let t=window;return t.App||(t.App={}),t.App.items||(t.App.items=[]),t.App.items}function _t(t){let n=window;n.App||(n.App={}),n.App.items=t}function gt(){let t=document.getElementById("dinhMucBody"),n=document.getElementById("orderMobileCards"),o=(document.getElementById("orderSearch")?.value||"").toLowerCase(),e=document.getElementById("fLoai")?.value||"",a=document.getElementById("fChiNhap")?.checked,i=document.getElementById("orderSupplyChannel")?.value||"ALL",s=q().filter(l=>{if(o&&!l.maHang.toLowerCase().includes(o)&&!l.tenSP.toLowerCase().includes(o)||e&&l.tenLoai!==e||a&&(!l.soLuongDat||l.soLuongDat<=0))return!1;if(i==="BTT"){let u=((l.nguonCung||"")+" "+(l.tenLoai||"")+" "+(l.tenSP||"")).toLowerCase();if(!u.includes("btt")&&!u.includes("trung t\xE2m")&&!u.includes("ch\u1EBF bi\u1EBFn"))return!1}else if(i==="NCC"){let u=((l.nguonCung||"")+" "+(l.tenLoai||"")).toLowerCase();if(u.includes("btt")||u.includes("trung t\xE2m"))return!1}else if(i==="URGENT"){let u=((l.nganh_hang||"")+" "+(l.tenLoai||"")+" "+(l.tenSP||"")).toLowerCase();if(!u.includes("t\u01B0\u01A1i")&&!u.includes("th\u1ECBt")&&!u.includes("rau")&&!u.includes("kh\u1EA9n"))return!1}return!0});if(!s.length){t&&(t.innerHTML='<tr><td colspan="8" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</td></tr>'),n&&(n.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 V\xF9ng \u0111\xE3 ch\u1ECDn.</div>');return}let d=window.innerWidth>=1024;t&&(d?t.innerHTML=s.map(l=>{let u=l.soLuongDat||"",p=(l.soLuongDat||0)*(l.donGia||0);return`
          <tr>
            <td class="col-code">${ie(l.maHang)}</td>
            <td><span class="font-medium text-gray-900 dark:text-white">${l.tenSP}</span></td>
            <td>${de("neutral",l.tenLoai||"CCDC")}</td>
            <td>${l.dvt||"C\xE1i"}</td>
            <td class="col-num"><span class="num">${M(l.donGia)}</span></td>
            <td class="col-num"><span class="num">${ce(l.daDat)}</span></td>
            <td class="col-num text-right">
              <input type="number" min="0" value="${u}" placeholder="0" class="input h-8 w-24 text-right num"
                oninput="onQtyChange('${l.maHang}', this.value)">
            </td>
            <td class="col-num font-semibold text-brand-600 dark:text-brand-400" id="subtotal-${l.maHang}">${M(p)}</td>
          </tr>
        `}).join(""):t.innerHTML=""),n&&(d?n.innerHTML="":n.innerHTML=s.map(l=>{let u=l.soLuongDat||"",p=(l.soLuongDat||0)*(l.donGia||0);return`
          <div class="data-card space-y-3">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-1.5 mb-1 flex-wrap">
                  ${ie(l.maHang)}
                  ${de("neutral",l.tenLoai||"CCDC")}
                  <span class="text-xs text-gray-500">\u0110VT: ${l.dvt||"C\xE1i"}</span>
                </div>
                <h4 class="font-medium text-sm text-gray-900 dark:text-white leading-snug">${l.tenSP}</h4>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs pt-2.5 border-t border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400">
              <div>
                <span class="text-xs text-gray-400">\u0110\u01A1n gi\xE1:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${M(l.donGia)}</div>
              </div>
              <div>
                <span class="text-xs text-gray-400">\u0110\xE3 \u0111\u1EB7t l\u0169y k\u1EBF:</span>
                <div class="font-medium text-gray-800 dark:text-gray-200 num">${ce(l.daDat)}</div>
              </div>
              <div class="col-span-2 pt-2 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-3">
                <div class="flex-1">
                  <label class="text-xs font-medium text-gray-700 dark:text-gray-300 block mb-1">S\u1ED1 l\u01B0\u1EE3ng \u0111\u1EB7t:</label>
                  <input type="number" min="0" value="${u}" placeholder="0" class="input h-10 w-full text-center num text-sm font-semibold"
                    oninput="onQtyChange('${l.maHang}', this.value)">
                </div>
                <div class="text-right">
                  <span class="text-xs text-gray-400">Th\xE0nh ti\u1EC1n:</span>
                  <div class="text-base font-semibold text-brand-600 dark:text-brand-400 num" id="mob-subtotal-${l.maHang}">${M(p)}</div>
                </div>
              </div>
            </div>
          </div>
        `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function En(){gt()}function Tn(t,n){let e=q().find(a=>a.maHang===t);if(e){e.soLuongDat=Number(n)||0;let a=document.getElementById(`subtotal-${t}`);a&&(a.textContent=M(e.soLuongDat*(e.donGia||0)));let i=document.getElementById(`mob-subtotal-${t}`);i&&(i.textContent=M(e.soLuongDat*(e.donGia||0))),document.querySelectorAll(`input[oninput*="'${t}'"]`).forEach(r=>{r.value!==n&&(r.value=n)})}pt()}function pt(t,n){let o=document.getElementById("kpiNganSach"),e=document.getElementById("kpiDaDat"),a=t!==void 0?Number(t):Number(o?.dataset?.raw)||Number((o?.textContent||"").replace(/[^\d]/g,""))||0,i=n!==void 0?Number(n):Number(e?.dataset?.raw)||Number((e?.textContent||"").replace(/[^\d]/g,""))||0,s=q().reduce((v,k)=>v+(k.soLuongDat||0)*(k.donGia||0),0),d=i+s,l=a-d,u=a>0?Math.round(d/a*100):0,p=document.getElementById("kpiConLai");p&&(p.dataset.raw=String(l),p.textContent=M(l),p.title=M(l),l<0?(p.classList.remove("text-gray-900","dark:text-white"),p.classList.add("text-rose-600","dark:text-rose-400")):(p.classList.remove("text-rose-600","dark:text-rose-400"),p.classList.add("text-gray-900","dark:text-white")));let m=document.getElementById("kpiDangNhapSub");m&&(m.textContent="\u0110ang nh\u1EADp: "+M(s));let b=document.getElementById("kpiConLaiDelta");b&&(l<0?(b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",b.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>\xC2m h\u1EA1n m\u1EE9c</span>'):(b.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",b.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>Kh\u1EA3 d\u1EE5ng</span>'));let h=document.getElementById("kpiTyLe");h&&(h.textContent=u+"%",u>100?h.className="text-xl sm:text-2xl font-bold font-mono text-rose-600 dark:text-rose-400 tabular-nums tracking-tight num":u>80?h.className="text-xl sm:text-2xl font-bold font-mono text-amber-600 dark:text-amber-400 tabular-nums tracking-tight num":h.className="text-xl sm:text-2xl font-bold font-mono text-gray-900 dark:text-white tabular-nums tracking-tight num");let c=document.getElementById("budUsed");c&&(c.textContent=M(d));let y=document.getElementById("budFill"),f=document.getElementById("budBadge"),x=document.getElementById("budNote");y&&(y.style.width=Math.min(u,100)+"%",u>100?(y.className="h-full rounded-full bg-rose-500 transition-all duration-300",f&&(f.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",f.innerHTML=`<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6"/></svg><span>V\u01B0\u1EE3t ${u-100}%</span>`),x&&(x.innerHTML=`<span class="text-rose-600 dark:text-rose-400 font-semibold">\u26A0\uFE0F V\u01B0\u1EE3t \u0111\u1ECBnh m\u1EE9c ${u-100}%! C\u1EA7n gi\u1EA3i tr\xECnh.</span>`)):u>80?(y.className="h-full rounded-full bg-amber-500 transition-all duration-300",f&&(f.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50",f.innerHTML="<span>G\u1EA7n ch\u1EA1m tr\u1EA7n</span>"),x&&(x.textContent=`\u0110\xE3 d\xF9ng ${u}% ng\xE2n s\xE1ch. G\u1EA7n ch\u1EA1m m\u1EE9c gi\u1EDBi h\u1EA1n.`)):(y.className="h-full rounded-full bg-indigo-500 transition-all duration-300",f&&(f.className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",f.innerHTML='<svg class="w-3 h-3 stroke-[2.5]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/></svg><span>An to\xE0n</span>'),x&&(x.textContent=`Ng\xE2n s\xE1ch an to\xE0n (${u}%).`)))}async function ue(){let t=window,n=localStorage.getItem("orbit_user_site")||t.gCurrentUser&&t.gCurrentUser.assignedSite||"K001",e=((typeof getAppSitesList=="function"?getAppSitesList():[])||t.App&&t.App.siteObjs||[]).find(l=>(l.code||"").toLowerCase()===n.toLowerCase()),a=e?e.ten||e.name:document.getElementById("orderSite")?.value||n,i=document.getElementById("orderSite");if(i&&(i.innerHTML=`<option value="${a}">${a}</option>`,i.value=a),!a)return;let r=document.getElementById("globalMonthPicker")?.value,s=document.getElementById("orderMonth")?.value;if(!s||r&&s!==r){s=r||`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}`;let l=document.getElementById("orderMonth");l&&(l.value=s)}let d="";if(s){let l=s.split("-");d=`${l[1]}/${l[0]}`}typeof showLoading=="function"&&showLoading("T\u1EA3i danh s\xE1ch v\u1EADt t\u01B0 theo Site...");try{let u=await(await fetch(`/api/quota?site=${encodeURIComponent(a)}&thang=${encodeURIComponent(d)}&refresh=true`)).json();if(u.success){_t(u.data.items||[]);let p=document.getElementById("kpiNganSach");p&&(p.dataset.raw=String(u.data.nganSach),p.textContent=M(u.data.nganSach),p.title=M(u.data.nganSach));let m=document.getElementById("kpiSubSite");m&&(m.textContent=u.data.site||a,m.title=u.data.site||a);let b=document.getElementById("kpiDaDat");b&&(b.dataset.raw=String(u.data.tienDaDat),b.textContent=M(u.data.tienDaDat),b.title=M(u.data.tienDaDat));let h=document.getElementById("budTotal");h&&(h.textContent=M(u.data.nganSach));let c=q(),y=Array.from(new Set(c.map(x=>x.tenLoai).filter(Boolean))),f=document.getElementById("fLoai");f&&(f.innerHTML='<option value="">T\u1EA5t c\u1EA3 lo\u1EA1i NVL</option>'+y.map(x=>`<option value="${x}">${x}</option>`).join("")),gt(),pt(u.data.nganSach,u.data.tienDaDat),t.lucide&&t.lucide.createIcons&&t.lucide.createIcons()}else typeof showToast=="function"&&showToast("L\u1ED7i t\u1EA3i \u0111\u1ECBnh m\u1EE9c: "+(u.error||""))}catch(l){typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i: "+(l?.message||l))}finally{typeof hideLoading=="function"&&hideLoading()}}function In(){let n=q().filter(r=>(r.soLuongDat||0)>0);if(!n.length){typeof showToast=="function"&&showToast("Vui l\xF2ng nh\u1EADp s\u1ED1 l\u01B0\u1EE3ng cho \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng.");return}let o=document.getElementById("orderSite")?.value||"",e=document.getElementById("orderMonth")?.value||"",a=n.reduce((r,s)=>r+(s.soLuongDat||0)*(s.donGia||0),0),i=`
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
              <div class="font-bold text-gray-900 dark:text-white truncate">${le(r.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${le(r.maHang)}</div>
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
  `;typeof openGeneralModal=="function"&&openGeneralModal("X\xE1c nh\u1EADn \u0111\u1EB7t h\xE0ng v\u1EADt t\u01B0",i)}async function Mn(){let t=window,n=q(),o=n.filter(s=>(s.soLuongDat||0)>0),e=document.getElementById("orderSite")?.value||"",a=document.getElementById("orderMonth")?.value||"",i=document.getElementById("orderNote"),r=i?i.value:"";typeof showLoading=="function"&&showLoading("L\u01B0u \u0111\u01A1n h\xE0ng v\xE0o Cloudflare D1...");try{let s={site:e,thang:a,nguoiDat:t.App&&t.App.user?t.App.user.email:"B\u1EBFp tr\u01B0\u1EDFng Site",ghiChu:r,items:o.map(u=>({maHang:u.maHang,tenSP:u.tenSP,dvt:u.dvt,donGia:u.donGia,soLuong:u.soLuongDat||0,daDat:u.daDat}))},l=await(await fetch("/api/order",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();l.success?(typeof closeGeneralModal=="function"&&closeGeneralModal(),typeof showToast=="function"&&showToast(`\u0110\xE3 t\u1EA1o \u0111\u01A1n h\xE0ng th\xE0nh c\xF4ng! M\xE3: ${l.data.maDon}`),n.forEach(u=>{u.soLuongDat=0}),ue()):typeof showToast=="function"&&showToast("L\u1ED7i: "+l.error)}catch(s){typeof showToast=="function"&&showToast("L\u1ED7i: "+(s?.message||s))}finally{typeof hideLoading=="function"&&hideLoading()}}var U=window;U.loadQuota=ue;U.renderOrderTable=gt;U.filterItems=En;U.onQtyChange=Tn;U.calcBudget=pt;U.reviewOrder=In;U.submitOrder=Mn;U.getAppOrderItems=q;U.setAppOrderItems=_t;function ge(t){return typeof window.cellCode=="function"?window.cellCode(t):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${t}</span>`}function $n(t){return typeof window.cellDate=="function"?window.cellDate(t):`<span class="tabular-nums text-xs text-gray-500">${G(t)}</span>`}function pe(t){return typeof window.cellPerson=="function"?window.cellPerson(t):`<span class="text-xs font-medium text-gray-700 dark:text-gray-300">${S(t||"\u2014")}</span>`}function me(t,n){return typeof window.cellBadge=="function"?window.cellBadge(t,n):`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">${n}</span>`}function S(t){return t==null?"":String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function N(t){return typeof window.fmtVND=="function"?window.fmtVND(t):et(Number(t)||0)}function st(t){return typeof window.fmtNum=="function"?window.fmtNum(t):B(Number(t)||0)}function G(t){return t?typeof window.fmtDate=="function"?window.fmtDate(t):Te(t):"\u2014"}function X(t){let n=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let e=o.permissions["portal-history"],a=o.permissions["portal-order"];if(e&&e.canEdit!==void 0)return!!e.canEdit;if(a&&a.canEdit!==void 0)return!!a.canEdit}if(o.role==="BEP_TRUONG"){if(!t)return!0;let e=(t.trangThai||t.status||"").toUpperCase();return e.includes("M\u1EDAI")||e.includes("CH\u1EDC")||e.includes("PENDING")||e===""}return!1}function K(t){let n=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let e=o.permissions["portal-history"],a=o.permissions["portal-order"];if(e&&e.canDelete!==void 0)return!!e.canDelete;if(a&&a.canDelete!==void 0)return!!a.canDelete}if(o.role==="BEP_TRUONG"){if(!t)return!0;let e=(t.trangThai||t.status||"").toUpperCase();return e.includes("M\u1EDAI")||e.includes("CH\u1EDC")||e.includes("PENDING")||e===""}return!1}function Bt(t){let n=window,o=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||n.gCurrentUser;if(!o)return!1;if(o.role==="ADMIN"||o.role==="KHO_TRUONG"||o.role==="SUPER_ADMIN")return!0;if(o.permissions&&typeof o.permissions=="object"){let e=o.permissions["portal-history"],a=o.permissions["portal-order"];if(e&&(e.canAuthenticate!==void 0||e.canVerify!==void 0||e.canEdit!==void 0))return!!(e.canAuthenticate||e.canVerify||e.canEdit);if(a&&(a.canAuthenticate!==void 0||a.canVerify!==void 0||a.canEdit!==void 0))return!!(a.canAuthenticate||a.canVerify||a.canEdit)}return!1}function Ht(t,n,o){let e=Number(t)||1,i=n||{1:"Site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn",3:"Chuy\u1EC3n Tr\u01B0\u1EDFng Kho",4:"Mail cho PMH",5:"PMH \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"\u0110\xE3 giao v\u1EC1 site"}[e]||`B\u01B0\u1EDBc ${e}`,r="bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/60",s="bg-blue-500";return e>=7?(r="bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/60",s="bg-emerald-500"):e>=4?(r="bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/60",s="bg-indigo-500"):e>=2&&(r="bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/60",s="bg-amber-500"),`
    <button type="button" onclick="openOrderJourneyModal('${o}')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${r} hover:shadow-2xs hover:scale-[1.02] active:scale-[0.98] transition cursor-pointer" title="B\u1EA5m \u0111\u1EC3 xem v\xE0 x\xE1c th\u1EF1c h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng">
      <span class="w-1.5 h-1.5 rounded-full ${s} animate-pulse shrink-0"></span>
      <span class="font-mono text-[11px] font-bold shrink-0">B${e}/7:</span>
      <span class="truncate max-w-[100px] text-left">${S(i)}</span>
    </button>
  `}function Nt(t){let n=document.getElementById("hsBody"),o=document.getElementById("hsMobileCards");if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}n&&(n.innerHTML=t.map(e=>{let a=X(e),i=K(e);return`
        <tr>
          <td class="col-code min-w-[130px]">${ge(e.maDon)}</td>
          <td class="col-date min-w-[110px]">${$n(e.ngayDat)}</td>
          <td class="min-w-[260px] max-w-[360px]">
            <div class="font-semibold text-gray-900 dark:text-gray-100 text-sm whitespace-normal leading-snug break-words">
              ${S(e.site||"\u2014")}
            </div>
          </td>
          <td class="min-w-[130px]">${pe(e.nguoiDat)}</td>
          <td class="col-num">${e.soDong}</td>
          <td class="col-num font-medium">${st(e.tongSL)}</td>
          <td class="col-num font-semibold text-brand-600 dark:text-brand-400">${N(e.tongTien)}</td>
          <td class="col-badge min-w-[140px] text-center">${me("neutral",e.trangThai||"M\u1EDBi t\u1EA1o")}</td>
          <td class="text-center min-w-[170px]">
            ${Ht(e.currentStep,e.currentStepName,e.maDon)}
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
      `}).join("")),o&&(o.innerHTML=t.map(e=>{let a=X(e),i=K(e);return`
        <div class="data-card space-y-3 p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xs">
          <div class="flex items-center justify-between gap-2">
            ${ge(e.maDon)}
            ${me("neutral",e.trangThai||"M\u1EDBi t\u1EA1o")}
          </div>
          <div class="font-bold text-sm text-gray-900 dark:text-white leading-snug break-words">
            ${S(e.site||"\u2014")}
          </div>
          <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40">
            <div class="flex items-center gap-1.5 text-xs font-semibold text-indigo-900 dark:text-indigo-200">
              <span class="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              <span>Ti\u1EBFn \u0111\u1ED9:</span>
            </div>
            ${Ht(e.currentStep,e.currentStepName,e.maDon)}
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.03] text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="num text-gray-900 dark:text-white whitespace-nowrap">${G(e.ngayDat)}</b></div>
            <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b>${pe(e.nguoiDat)}</b></div>
            <div>S\u1ED1 m\u1EB7t h\xE0ng: <b class="num text-gray-900 dark:text-white">${e.soDong} d\xF2ng</b></div>
            <div>T\u1ED5ng SL: <b class="num text-gray-900 dark:text-white">${st(e.tongSL)}</b></div>
            <div class="col-span-2 flex justify-between items-center pt-1.5 border-t border-gray-100 dark:border-gray-800">
              <span class="text-gray-500 font-medium">T\u1ED5ng gi\xE1 tr\u1ECB \u0111\u01A1n:</span>
              <span class="num font-semibold text-sm text-brand-600 dark:text-brand-400">${N(e.tongTien)}</span>
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
      `}).join(""))}function fe(t){let n=window,o=n.App&&n.App.historyOrders?n.App.historyOrders:[];if(!t||t==="ALL"){Nt(o);return}let e=o.filter(a=>{let i=(a.trangThai||"").toUpperCase();return t==="APPROVED"?i.includes("DUY\u1EC6T")||i.includes("APPROVED"):t==="PENDING"?i.includes("CH\u1EDC")||i.includes("T\u1EA0O")||i.includes("PENDING"):t==="DELIVERED"?i.includes("NH\u1EACN")||i.includes("GIAO")||i.includes("DELIVERED"):t==="REJECTED"?i.includes("H\u1EE6Y")||i.includes("T\u1EEA CH\u1ED0I")||i.includes("REJECT"):!0});Nt(e)}async function _n(){let t=window,n=document.getElementById("globalBranchSelect")?.value,o=t.gCurrentUser||(typeof t.loadPersistedUser=="function"?t.loadPersistedUser():null),e=o?o.assignedSite:"",a=localStorage.getItem("orbit_user_site"),i=document.getElementById("hsSite")?.value,r="";n?r=n==="ALL"?"":n:e?r=e==="ALL"?"":e:a?r=a==="ALL"?"":a:i&&(r=i==="ALL"?"":i);let s=document.getElementById("hsCurrentSiteBadge");if(s){if(r&&r!=="ALL"){let m=((typeof t.getAppSitesList=="function"?t.getAppSitesList():[])||[]).find(b=>b.code.toUpperCase()===r.toUpperCase()||b.name===r||b.ten&&b.ten===r);s.textContent=m?m.ten||m.name:r}else s.textContent="T\u1EA5t c\u1EA3 \u0111i\u1EC3m b\xE1n";s.classList.remove("hidden")}let d=document.getElementById("hsSite");d&&(d.value=r);let l=document.getElementById("hsMonth")?.value||"",u="";if(l){let p=l.split("-");u=`${p[1]}/${p[0]}`}try{typeof showLoading=="function"&&showLoading("T\u1EA3i l\u1ECBch s\u1EED \u0111\u01A1n h\xE0ng...");let p=`/api/orders?site=${encodeURIComponent(r)}&thang=${encodeURIComponent(u)}&_t=${Date.now()}`,b=await(await fetch(p,{cache:"no-store",headers:{"Cache-Control":"no-cache",Pragma:"no-cache"}})).json();t.App||(t.App={}),t.App.historyOrders=b.success&&b.data?b.data:[];let h=document.getElementById("hsOrderStatusFilter")?.value||"ALL";fe(h)}catch(p){console.error("loadHistory error:",p)}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}async function Bn(t){typeof showLoading=="function"&&showLoading("T\u1EA3i chi ti\u1EBFt \u0111\u01A1n...");try{let o=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}`)).json();if(o.success){let{info:e,items:a,timeline:i}=o.data,r=`
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
                ${(a||[]).map(s=>`<tr><td class="p-2 tabular-nums">${s.maHang}</td><td class="p-2">${s.tenSP}</td><td class="p-2">${s.dvt}</td><td class="p-2 text-right tabular-nums font-bold">${s.soLuong}</td><td class="p-2 text-right tabular-nums">${N(s.donGia)}</td><td class="p-2 text-right tabular-nums font-bold">${N(s.thanhTien)}</td></tr>`).join("")}
              </tbody>
            </table>
          </div>

          <!-- Native Mobile Cards for Order Details -->
          <div class="block sm:hidden space-y-2 max-h-48 overflow-y-auto">
            ${(a||[]).map(s=>`
              <div class="p-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-xs flex justify-between items-center gap-2">
                <div class="min-w-0">
                  <div class="font-bold text-gray-900 dark:text-white truncate">${S(s.tenSP)}</div>
                  <div class="font-mono text-[11px] text-gray-400">${S(s.maHang)} \xB7 <span class="font-sans">${S(s.dvt||"")}</span></div>
                </div>
                <div class="text-right shrink-0">
                  <div class="num font-bold text-brand-600 dark:text-brand-400">SL: ${s.soLuong}</div>
                  <div class="num text-[11px] text-gray-500">${N(s.thanhTien)}</div>
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
                    <span class="tabular-nums text-gray-400 dark:text-gray-500 font-normal">${s.thoiGian?G(s.thoiGian):""}</span>
                  </div>
                  <div class="text-gray-500 dark:text-gray-400 mt-0.5">${s.nguoiXuLy||"H\u1EC7 th\u1ED1ng"} \xB7 Tr\u1EA1ng th\xE1i: <span class="font-bold text-brand-700 dark:text-brand-400">${s.trangThai}</span>${s.ghiChu?` \xB7 <span class="italic text-gray-600 dark:text-gray-300">"${S(s.ghiChu)}"</span>`:""}</div>
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
              ${X(e)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); openEditOrderModal('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  <span>Ch\u1EC9nh s\u1EEDa \u0111\u01A1n</span>
                </button>
              `:""}
              ${K(e)?`
                <button onclick="if(typeof closeGeneralModal==='function')closeGeneralModal(); confirmDeleteOrder('${e.order_code}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/60 shadow-2xs transition">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  <span>X\xF3a \u0111\u01A1n h\xE0ng</span>
                </button>
              `:""}
            </div>
          </div>
        </div>
      `;typeof openGeneralModal=="function"&&openGeneralModal(`\u0110\u01A1n h\xE0ng ${t}`,r)}}catch(n){typeof showToast=="function"&&showToast("L\u1ED7i: "+(n?.message||n))}finally{typeof hideLoading=="function"&&hideLoading()}}var Hn=null,Nn=null,Ft=[{step:1,name:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",desc:"\u0110i\u1EC3m b\xE1n t\u1EA1o phi\u1EBFu \u0111\u1EB7t h\xE0ng th\xE0nh c\xF4ng qua h\u1EC7 th\u1ED1ng Portal"},{step:2,name:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",desc:"Admin/B\u1ED9 ph\u1EADn \u0111i\u1EC1u ph\u1ED1i ki\u1EC3m tra \u0111\u1ECBnh m\u1EE9c & duy\u1EC7t ti\u1EBFp nh\u1EADn \u0111\u01A1n"},{step:3,name:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",desc:"Th\u1EE7 kho ti\u1EBFp nh\u1EADn y\xEAu c\u1EA7u, ph\xE2n lo\u1EA1i v\xE0 chu\u1EA9n b\u1ECB k\u1EBF ho\u1EA1ch so\u1EA1n"},{step:4,name:"Kho mail cho PMH",desc:"Kho ph\u1ED1i h\u1EE3p ph\xF2ng mua h\xE0ng ho\u1EB7c nh\xE0 cung c\u1EA5p ki\u1EC3m tra t\u1ED3n kho"},{step:5,name:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",desc:"Ph\xF2ng mua h\xE0ng x\xE1c nh\u1EADn \u0111\u01A1n h\xE0ng v\u1EDBi NCC ho\u1EB7c xu\u1EA5t kho t\u1ED5ng"},{step:6,name:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",desc:"H\xE0ng h\xF3a t\u1EADp k\u1EBFt, ki\u1EC3m \u0111\u1EBFm ch\u1EA5t l\u01B0\u1EE3ng v\xE0 \u0111\xF3ng g\xF3i chuy\u1EC3n \u0111i"},{step:7,name:"Kho giao v\u1EC1 c\xE1c site",desc:"\u0110ang v\u1EADn chuy\u1EC3n giao v\u1EC1 \u0111i\u1EC3m b\xE1n / B\u1EBFp tr\u01B0\u1EDFng k\xFD nh\u1EADn \u0111\u1EE7"}];function Dt(t,n){let o=document.getElementById("journeyTimelineContainer");if(!o)return;let e=document.getElementById("journeyCurrentStepText"),a={};(n||[]).forEach(s=>{let d=Number(s.buoc);d&&(a[d]=s)});let i=Object.keys(a).map(Number),r=i.length?Math.max(...i):1;e&&(e.textContent=`B\u01B0\u1EDBc ${r}/7 (${Ft[r-1]?.name||""})`),o.innerHTML=Ft.map(s=>{let d=a[s.step],l=d&&(d.trangThai==="Ho\xE0n th\xE0nh"||d.trangThai==="Ho\xE0n t\u1EA5t"),u=s.step===r||d&&!l,p="bg-gray-100 text-gray-400 border-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700",m=`<span class="font-mono text-xs font-bold">${s.step}</span>`,b="border-gray-200/80 dark:border-gray-800/80 bg-white dark:bg-gray-900/60",h="text-gray-500 dark:text-gray-400 font-medium",c='<span class="px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400">Ch\u1EDD x\u1EED l\xFD</span>';return l?(p="bg-emerald-600 text-white border-emerald-600 shadow-sm",m='<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>',b="border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/30 dark:bg-emerald-950/20",h="text-emerald-900 dark:text-emerald-200 font-bold",c='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>\u0110\xE3 ho\xE0n th\xE0nh</span>'):u&&(p="bg-indigo-600 text-white border-indigo-600 shadow-sm ring-4 ring-indigo-100 dark:ring-indigo-950/60",m='<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4" stroke-dashoffset="10"/></svg>',b="border-indigo-300 dark:border-indigo-700 bg-indigo-50/40 dark:bg-indigo-950/30 ring-1 ring-indigo-200 dark:ring-indigo-800/50",h="text-indigo-900 dark:text-indigo-100 font-bold",c='<span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300 flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-ping"></span>\u0110ang x\u1EED l\xFD</span>'),`
      <div class="relative flex items-start gap-3 group">
        <div class="absolute -left-[27px] top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-transform group-hover:scale-110 ${p}">
          ${m}
        </div>
        <div class="flex-1 p-3 rounded-xl border ${b} shadow-2xs space-y-1.5">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs ${h}">B\u01B0\u1EDBc ${s.step}: ${S(d?.tenBuoc||s.name)}</span>
            ${c}
          </div>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">${S(s.desc)}</p>
          ${d?`
            <div class="pt-1.5 mt-1 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-[11px]">
              <div class="text-gray-600 dark:text-gray-300">
                Ng\u01B0\u1EDDi x\u1EED l\xFD: <b class="text-gray-900 dark:text-white">${S(d.nguoiXuLy||"H\u1EC7 th\u1ED1ng")}</b>
              </div>
              <div class="text-gray-400 dark:text-gray-500 font-mono">
                ${d.thoiGian?G(d.thoiGian):""}
              </div>
              ${d.ghiChu?`
                <div class="w-full text-gray-700 dark:text-gray-300 italic bg-white/70 dark:bg-gray-800/60 p-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                  " ${S(d.ghiChu)} "
                </div>
              `:""}
            </div>
          `:""}
        </div>
      </div>
    `}).join("")}async function Fn(t){if(!t)return;Hn=t,window._currentJourneyOrderCode=t;let n=document.getElementById("modalOrderJourney");if(!n)return;let o=document.getElementById("journeyOrderSubtitle");o&&(o.textContent=`M\xE3 \u0111\u01A1n: ${t}`),typeof showLoading=="function"&&showLoading("T\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng...");try{let a=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!a.success||!a.data){typeof showToast=="function"&&showToast(a.error||"Kh\xF4ng th\u1EC3 t\u1EA3i h\xE0nh tr\xECnh \u0111\u01A1n h\xE0ng","error");return}let{info:i,timeline:r}=a.data;Nn=a.data,window._currentJourneyData=a.data;let s=document.getElementById("journeySiteName");s&&(s.textContent=i.site_name||i.site||"\u2014");let d=document.getElementById("journeyOrderedBy");d&&(d.textContent=i.ordered_by||"\u2014");let l=document.getElementById("journeyOrderDate");l&&(l.textContent=G(i.order_date||""));let u=document.getElementById("journeyBadgeStatus");u&&(u.textContent=i.status||"\u0110ang x\u1EED l\xFD"),Dt(i,r||[]);let p=Bt(i),m=document.getElementById("journeyAdminSection");if(m)if(p){m.classList.remove("hidden");let b=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,h=document.getElementById("journeyAdminActor");h&&(h.textContent=b&&(b.fullName||b.email)||"Qu\u1EA3n tr\u1ECB vi\xEAn");let c=r&&r.length?Math.max(...r.map(v=>Number(v.buoc)||1)):1,y=Math.min(c+1,7),f=document.getElementById("journeySelectStep");f&&(f.value=String(y));let x=document.getElementById("journeyStepNote");x&&(x.value="")}else m.classList.add("hidden");n.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(e){console.error("Error openOrderJourneyModal:",e),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi t\u1EA3i h\xE0nh tr\xECnh","error")}finally{typeof hideLoading=="function"&&hideLoading()}}function Dn(){let t=document.getElementById("modalOrderJourney");t&&t.classList.add("hidden")}async function Rn(){let t=Hn||window._currentJourneyOrderCode;if(!t)return;let n=document.getElementById("journeySelectStep"),o=document.getElementById("journeyStepStatus"),e=document.getElementById("journeyStepNote"),a=document.getElementById("btnSubmitJourneyStep"),i=Number(n?n.value:1),r=o?o.value:"Ho\xE0n th\xE0nh",s=e?e.value.trim():"",d=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser,l=d&&(d.fullName||d.email)||"Admin",p={1:"Qu\u1EA3n l\xFD site \u0111\u1EB7t h\xE0ng",2:"Admin ti\u1EBFp nh\u1EADn \u0111\u01A1n h\xE0ng",3:"Chuy\u1EC3n b\u1ED9 ph\u1EADn Tr\u01B0\u1EDFng Kho",4:"Kho mail cho PMH",5:"PMH ti\u1EBFp nh\u1EADn & \u0111\u1EB7t h\xE0ng",6:"V\u1EADn chuy\u1EC3n v\u1EC1 kho",7:"Kho giao v\u1EC1 c\xE1c site"}[i]||`B\u01B0\u1EDBc ${i}`;try{a&&(a.disabled=!0,a.innerHTML='<span class="inline-block animate-spin mr-1">\u23F3</span> \u0110ang l\u01B0u...');let b=await(await fetch("/api/order-journey",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,step:i,stepName:p,status:r,note:s,actor:l})})).json();if(!b.success){typeof showToast=="function"&&showToast(b.error||"C\u1EADp nh\u1EADt b\u01B0\u1EDBc h\xE0nh tr\xECnh th\u1EA5t b\u1EA1i","error");return}if(typeof showToast=="function"&&showToast(`\u0110\xE3 x\xE1c th\u1EF1c th\xE0nh c\xF4ng B\u01B0\u1EDBc ${i}: ${p}`,"success"),b.data&&b.data.timeline){let h=Nn?.info||window._currentJourneyData?.info||{order_code:t};h.status=b.data.orderStatus;let c=document.getElementById("journeyBadgeStatus");c&&(c.textContent=h.status),Dt(h,b.data.timeline),n&&i<7&&(n.value=String(i+1)),e&&(e.value="")}typeof window.loadHistory=="function"&&window.loadHistory()}catch(m){console.error("Error submitJourneyStep:",m),typeof showToast=="function"&&showToast("L\u1ED7i k\u1EBFt n\u1ED1i khi c\u1EADp nh\u1EADt ti\u1EBFn \u0111\u1ED9","error")}finally{a&&(a.disabled=!1,a.innerHTML='<i data-lucide="check" class="w-3.5 h-3.5"></i><span>X\xE1c nh\u1EADn c\u1EADp nh\u1EADt b\u01B0\u1EDBc n\xE0y</span>',typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons())}}var _=[],be=null;async function An(t){if(!X()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}typeof showLoading=="function"&&showLoading("\u0110ang t\u1EA3i th\xF4ng tin \u0111\u01A1n h\xE0ng...");try{let o=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(!o.success||!o.data)throw new Error(o.error||"Kh\xF4ng t\u1EA3i \u0111\u01B0\u1EE3c chi ti\u1EBFt \u0111\u01A1n h\xE0ng");let{info:e,items:a}=o.data,i=document.getElementById("editOrderCode");i&&(i.value=e.order_code||t);let r=document.getElementById("editOrderSubtitle");r&&(r.textContent=`M\xE3 \u0111\u01A1n: ${e.order_code||t}`);let s=document.getElementById("editOrderSite");if(s){let c=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[])||[];s.innerHTML=c.map(y=>{let f=y.ten||y.name||y.code||y,x=e.site_name===f||e.site_name===y.name||e.site_name===y.code?"selected":"";return`<option value="${f}" ${x}>${f}</option>`}).join(""),e.site_name&&!c.some(y=>(y.ten||y.name||y.code)===e.site_name)&&s.insertAdjacentHTML("afterbegin",`<option value="${e.site_name}" selected>${e.site_name}</option>`)}let d=document.getElementById("editOrderDate");d&&(d.value=(e.order_date||"").slice(0,10));let l=document.getElementById("editOrderStatus");l&&(l.value=e.status||"M\u1EDBi t\u1EA1o");let u=document.getElementById("editOrderNguoiDat");u&&(u.value=e.ordered_by||"");let p=document.getElementById("editOrderThang");p&&(p.value=e.applied_month||"");let m=document.getElementById("editOrderGhiChu");m&&(m.value=""),_=(a||[]).map(c=>({maHang:c.maHang||c.item_code,tenSP:c.tenSP||c.item_name,dvt:c.dvt||c.unit||"Ph\u1EA7n",soLuong:Number(c.soLuong??c.order_qty??1),donGia:Number(c.donGia??c.unit_price??0),thanhTien:Number(c.thanhTien??(c.soLuong||1)*(c.donGia||0)),ghiChu:c.ghiChu||""})),window._editOrderItems=_;let b=document.getElementById("editOrderAddSelect");if(b){let c=window,y=c.App&&c.App.items&&c.App.items.length?c.App.items:[];if(!y.length)try{let x=await(await fetch(`/api/quota?site=${encodeURIComponent(e.site_name||"K001")}&thang=${encodeURIComponent(e.applied_month||"")}`)).json();x.success&&x.data?.items&&(y=x.data.items,c.App&&(c.App.items=y))}catch{}b.innerHTML='<option value="">-- Ch\u1ECDn m\u1EB7t h\xE0ng mu\u1ED1n th\xEAm --</option>'+y.map(f=>`
          <option value="${S(f.maHang||f.code)}" 
                  data-name="${S(f.tenHang||f.tenSP||f.name||"")}" 
                  data-unit="${S(f.dvt||f.unit||"Ph\u1EA7n")}" 
                  data-price="${Number(f.donGia||f.price||0)}">
            [${S(f.maHang||f.code)}] ${S(f.tenHang||f.tenSP||f.name||"")} (${N(f.donGia||f.price||0)}/${f.dvt||f.unit||""})
          </option>
        `).join("")}it();let h=document.getElementById("modalEditOrder");h&&h.classList.remove("hidden")}catch(n){console.error("openEditOrderModal error:",n),typeof showToast=="function"&&showToast("L\u1ED7i: "+(n?.message||n),"error")}finally{typeof hideLoading=="function"&&hideLoading(),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}}function he(){let t=document.getElementById("modalEditOrder");t&&t.classList.add("hidden"),_=[],window._editOrderItems=[]}function it(){let t=document.getElementById("editOrderItemsBody"),n=document.getElementById("editOrderItemsMobile"),o=_;t&&(o.length?t.innerHTML=o.map((e,a)=>`
        <tr class="hover:bg-gray-50/50 dark:hover:bg-gray-800/30">
          <td class="p-2.5 text-center text-gray-400 font-mono">${a+1}</td>
          <td class="p-2.5 font-mono font-medium text-gray-900 dark:text-white">${S(e.maHang)}</td>
          <td class="p-2.5 font-medium text-gray-800 dark:text-gray-200">${S(e.tenSP)}</td>
          <td class="p-2.5 text-center text-gray-500">${S(e.dvt)}</td>
          <td class="p-2.5 text-right">
            <input type="number" min="0.1" step="0.5" value="${e.soLuong}" 
                   onchange="updateEditOrderItemQty(${a}, this.value)" 
                   class="w-20 px-2 py-1 text-right font-mono font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:border-brand-500">
          </td>
          <td class="p-2.5 text-right font-mono text-gray-500">${N(e.donGia)}</td>
          <td class="p-2.5 text-right font-mono font-bold text-brand-600 dark:text-brand-400">${N(e.soLuong*e.donGia)}</td>
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
              <div class="font-bold text-gray-900 dark:text-white">${S(e.tenSP)}</div>
              <div class="font-mono text-[11px] text-gray-400">${S(e.maHang)} \xB7 <span class="font-sans">${S(e.dvt)}</span></div>
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
              <div class="font-mono font-bold text-brand-600 dark:text-brand-400">${N(e.soLuong*e.donGia)}</div>
            </div>
          </div>
        </div>
      `).join(""):n.innerHTML='<div class="p-4 text-center text-gray-400 bg-gray-50 dark:bg-gray-800/40 rounded-xl">Ch\u01B0a c\xF3 m\u1EB7t h\xE0ng n\xE0o</div>'),ye()}function On(t,n){let o=Math.max(0,Number(n)||0);_&&_[t]&&(_[t].soLuong=o,_[t].thanhTien=o*(_[t].donGia||0),it())}function Pn(t){_&&_.length>t&&(_.splice(t,1),it())}function jn(){let t=document.getElementById("editOrderAddSelect"),n=document.getElementById("editOrderAddQty");if(!t||!t.value){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn m\u1ED9t m\u1EB7t h\xE0ng \u0111\u1EC3 th\xEAm","warning");return}let o=t.value,e=t.selectedOptions[0],a=e.getAttribute("data-name")||o,i=e.getAttribute("data-unit")||"Ph\u1EA7n",r=Number(e.getAttribute("data-price"))||0,s=Math.max(.1,Number(n?n.value:1)||1),d=_.find(l=>l.maHang===o);d?(d.soLuong+=s,d.thanhTien=d.soLuong*d.donGia):_.push({maHang:o,tenSP:a,dvt:i,soLuong:s,donGia:r,thanhTien:s*r,ghiChu:""}),t.value="",n&&(n.value="1"),it()}function ye(){let t=_,n=0,o=0;t.forEach(r=>{n+=Number(r.soLuong)||0,o+=(Number(r.soLuong)||0)*(Number(r.donGia)||0)});let e=document.getElementById("editOrderItemsCount");e&&(e.textContent=String(t.length));let a=document.getElementById("editOrderTotalQty");a&&(a.textContent=st(n));let i=document.getElementById("editOrderTotalAmount");i&&(i.textContent=N(o))}async function Vn(){if(!X()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n ch\u1EC9nh s\u1EEDa \u0111\u01A1n h\xE0ng","warning");return}let t=document.getElementById("editOrderCode")?.value;if(!t){typeof showToast=="function"&&showToast("Thi\u1EBFu m\xE3 \u0111\u01A1n h\xE0ng","error");return}let n=document.getElementById("editOrderSite")?.value,o=document.getElementById("editOrderDate")?.value,e=document.getElementById("editOrderStatus")?.value,a=document.getElementById("editOrderNguoiDat")?.value,i=document.getElementById("editOrderThang")?.value,r=document.getElementById("editOrderGhiChu")?.value,s=_.filter(l=>(Number(l.soLuong)||0)>0);if(!s.length){typeof showToast=="function"&&showToast("\u0110\u01A1n h\xE0ng ph\u1EA3i c\xF3 \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng c\xF3 s\u1ED1 l\u01B0\u1EE3ng > 0","warning");return}let d=(typeof getAppCurrentUser=="function"?getAppCurrentUser():null)||window.gCurrentUser;typeof showLoading=="function"&&showLoading("\u0110ang l\u01B0u c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng...");try{let u=await(await fetch("/api/order",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t,site:n,orderDate:o,status:e,orderedBy:a,month:i,ghiChu:r,actor:d?d.full_name||d.fullName||d.email:"Ng\u01B0\u1EDDi qu\u1EA3n tr\u1ECB",items:s})})).json();if(!u.success)throw new Error(u.error||"C\u1EADp nh\u1EADt th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),he(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(l){console.error("saveEditOrder error:",l),typeof showToast=="function"&&showToast("L\u1ED7i l\u01B0u \u0111\u01A1n h\xE0ng: "+(l?.message||l),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}async function Wn(t){if(!K()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning");return}be=t,window._pendingDeleteOrderCode=t;let n=document.getElementById("confirmDeleteOrderCode");n&&(n.textContent=t);let o=document.getElementById("confirmDeleteOrderInfo");o&&(o.innerHTML='<span class="text-gray-400">\u0110ang t\u1EA3i chi ti\u1EBFt \u0111\u01A1n...</span>');let e=document.getElementById("modalConfirmDeleteOrder");e&&e.classList.remove("hidden"),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons();try{let i=await(await fetch(`/api/order-detail?orderCode=${encodeURIComponent(t)}&_t=${Date.now()}`)).json();if(i.success&&i.data&&o){let{info:r,items:s}=i.data,d=(s||[]).reduce((u,p)=>u+(Number(p.thanhTien)||0),0),l=(s||[]).reduce((u,p)=>u+(Number(p.soLuong)||0),0);o.innerHTML=`
        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div>\u0110i\u1EC3m b\xE1n: <b class="text-gray-900 dark:text-white truncate block">${S(r.site_name||"\u2014")}</b></div>
          <div>Ng\xE0y \u0111\u1EB7t: <b class="num font-medium text-gray-900 dark:text-white">${G(r.order_date)}</b></div>
          <div>Ng\u01B0\u1EDDi \u0111\u1EB7t: <b class="text-gray-900 dark:text-white truncate block">${S(r.ordered_by||"\u2014")}</b></div>
          <div>Tr\u1EA1ng th\xE1i: <b class="text-brand-600 dark:text-brand-400">${S(r.status||"M\u1EDBi t\u1EA1o")}</b></div>
          <div class="col-span-2 pt-1 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center">
            <span>M\u1EB7t h\xE0ng: <b>${s.length} m\xF3n (${st(l)} SL)</b></span>
            <span class="font-bold text-sm text-brand-600 dark:text-brand-400">${N(d)}</span>
          </div>
        </div>
      `}}catch{}}function Rt(){let t=document.getElementById("modalConfirmDeleteOrder");t&&t.classList.add("hidden"),be=null,window._pendingDeleteOrderCode=null}async function qn(){let t=be||window._pendingDeleteOrderCode;if(t){if(!K()){typeof showToast=="function"&&showToast("T\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n x\xF3a \u0111\u01A1n h\xE0ng","warning"),Rt();return}typeof showLoading=="function"&&showLoading("\u0110ang x\xF3a \u0111\u01A1n h\xE0ng kh\u1ECFi CSDL...");try{let o=await(await fetch(`/api/order?orderCode=${encodeURIComponent(t)}`,{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({orderCode:t})})).json();if(!o.success)throw new Error(o.error||"X\xF3a th\u1EA5t b\u1EA1i");typeof showToast=="function"&&showToast(`\u0110\xE3 x\xF3a v\u0129nh vi\u1EC5n \u0111\u01A1n h\xE0ng ${t} th\xE0nh c\xF4ng!`,"success"),Rt(),typeof window.loadHistory=="function"&&window.loadHistory()}catch(n){console.error("executeDeleteOrder error:",n),typeof showToast=="function"&&showToast("L\u1ED7i x\xF3a \u0111\u01A1n: "+(n?.message||n),"error")}finally{typeof hideLoading=="function"&&hideLoading()}}}var E=window;E.renderJourneyBadge=Ht;E.renderHsOrdersList=Nt;E.filterHsOrders=fe;E.loadHistory=_n;E.viewOrderDetail=Bn;E.canEditOrders=X;E.canDeleteOrders=K;E.canAuthenticateJourney=Bt;E.STANDARD_STEPS=Ft;E.renderJourneyTimeline=Dt;E.openOrderJourneyModal=Fn;E.closeOrderJourneyModal=Dn;E.submitJourneyStep=Rn;E.openEditOrderModal=An;E.closeEditOrderModal=he;E.renderEditOrderItems=it;E.updateEditOrderItemQty=On;E.removeEditOrderItemLine=Pn;E.addEditOrderItemLine=jn;E.recalcEditOrderTotals=ye;E.saveEditOrder=Vn;E.confirmDeleteOrder=Wn;E.closeDeleteOrderModal=Rt;E.executeDeleteOrder=qn;function xe(t){return t==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse":t==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800":"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"}function Un(t){return t==="red"?"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800":t==="yellow"?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800":"bg-gray-50 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300 border-gray-200/70 dark:border-gray-700/60"}function Gn(t,n){return t<=0?n<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`${t} ng\xE0y`}function Xn(t,n){return t<=0?n<0?"T\u1ED3n \xE2m":"H\u1EBFt h\xE0ng":`C\xF2n ${t} ng\xE0y`}function we(t){return t==="red"?"text-rose-600 dark:text-rose-400":t==="yellow"?"text-amber-600 dark:text-amber-400":"text-emerald-600 dark:text-emerald-400"}function Kn(t){return t==="red"?"text-rose-600 dark:text-rose-400":t==="yellow"?"text-amber-600 dark:text-amber-400":"text-gray-900 dark:text-white"}function mt(t){return t.batch_code||t.batch_no||t.site_code||"KHO"}function ft(t){return t.unit||t.uom||"Ph\u1EA7n"}function dt(t){return typeof t=="number"?t:parseFloat(t||"0")||0}function ve(t){let n=dt(t);return B(n,2)}var D=1,At=10,Ot="fefo_priority",bt="asc",H=new Set;function Qn(){return H}function Jn(){return D}function zn(t){D=t}function ke(t){let n=document.getElementById("fefoTableBody"),o=document.getElementById("fefoMobileCards");if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="10" class="p-8 text-center text-gray-400 dark:text-gray-500">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 dark:text-gray-500 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y m\u1EB7t h\xE0ng n\xE0o ph\xF9 h\u1EE3p v\u1EDBi b\u1ED9 l\u1ECDc.</div>');return}n&&(n.innerHTML=t.map(e=>{let a=xe(e.danger_level),i=Un(e.danger_level),r=H.has(e.sku),s=mt(e),d=ft(e),l=e.exp_date?e.exp_date.slice(0,10):"\u2014",u=dt(e.qty),p=e.days_remaining!==void 0?e.days_remaining:e.days_left!==void 0?e.days_left:45,m=Gn(p,u),b=we(e.danger_level),h=(e.item_name||"").replace(/'/g,"\\'"),c=e.fefo_priority??1;return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3.5 text-center whitespace-nowrap">
            <input type="checkbox" class="stock-row-checkbox rounded border-gray-300 text-brand-500 focus:ring-brand-500 cursor-pointer" data-sku="${e.sku}" onchange="toggleStockItemSelect('${e.sku}', this.checked)" ${r?"checked":""}>
          </td>
          <td class="p-3.5 text-center whitespace-nowrap">
            <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs mx-auto">${c}</span>
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
              <span>${l}</span>
            </div>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold text-gray-900 dark:text-white whitespace-nowrap min-w-[110px]">
            ${ve(u)} <span class="font-sans text-xs font-normal text-gray-500">${d}</span>
          </td>
          <td class="p-3.5 text-right font-mono text-xs font-bold whitespace-nowrap min-w-[95px] ${b}">${m}</td>
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
              <button onclick="openIssueModal('${e.sku}', '${h}', '${s}', ${u})" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs shadow-xs flex items-center gap-1 transition-all">
                <i data-lucide="package-minus" class="w-3.5 h-3.5"></i> Xu\u1EA5t B\u1EBFp
              </button>
            </div>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(e=>{let a=xe(e.danger_level),i=mt(e),r=ft(e),s=e.exp_date?e.exp_date.slice(0,10):"\u2014",d=dt(e.qty),l=e.days_remaining!==void 0?e.days_remaining:e.days_left!==void 0?e.days_left:45,u=Xn(l,d),p=Kn(e.danger_level),m=we(e.danger_level),b=(e.item_name||"").replace(/'/g,"\\'");return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-mono font-bold text-xs shrink-0">P${e.fefo_priority??1}</span>
              <span class="font-bold text-xs text-gray-900 dark:text-white truncate">${e.item_name}</span>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold border shrink-0 whitespace-nowrap ${a}">${e.status_text||u}</span>
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
              <div class="inline-flex items-center gap-1 font-mono font-bold text-xs whitespace-nowrap ${p}">
                <i data-lucide="calendar" class="w-3 h-3 shrink-0 opacity-70"></i>
                <span>${s}</span>
              </div>
            </div>
            <div class="space-y-0.5 min-w-0">
              <div class="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 whitespace-nowrap">T\xECnh Tr\u1EA1ng H\u1EA1n</div>
              <div class="font-mono font-bold text-xs whitespace-nowrap ${m}">${u}</div>
            </div>
            <div class="col-span-2 flex justify-between items-center pt-2 border-t border-gray-200/60 dark:border-gray-800">
              <span class="text-xs text-gray-500 font-medium">T\u1ED3n kh\u1EA3 d\u1EE5ng:</span>
              <span class="font-mono font-bold text-sm whitespace-nowrap ${d<0?"text-rose-600":"text-brand-500 dark:text-brand-400"}">${ve(d)} <span class="font-sans text-xs font-normal text-gray-500">${r}</span></span>
            </div>
          </div>
          <div class="flex items-center justify-end gap-2 pt-1">
            <button onclick="openItemDetailModal('${e.sku}')" class="px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">Chi ti\u1EBFt</button>
            <button onclick="openIssueModal('${e.sku}', '${b}', '${i}', ${d})" class="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg flex items-center gap-1 transition-colors"><i data-lucide="package-minus" class="w-3 h-3"></i> Xu\u1EA5t B\u1EBFp</button>
          </div>
        </div>
      `}).join("")),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}function z(){let t=(document.getElementById("fefoSearchInput")?.value||"").toLowerCase().trim(),n=document.getElementById("fefoCategoryFilter")?.value||"",o=document.getElementById("fefoStatusFilter")?.value||"",a=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(h=>{let c=!t||h.sku&&h.sku.toLowerCase().includes(t)||h.item_name&&h.item_name.toLowerCase().includes(t)||h.batch_code&&h.batch_code.toLowerCase().includes(t)||h.batch_no&&h.batch_no.toLowerCase().includes(t),y=!n||h.category===n||!!h.category&&h.category.includes(n),f=!0;return o==="safe"?f=h.danger_level==="green":o==="yellow"?f=h.danger_level==="yellow":o==="red"?f=h.danger_level==="red":o&&(f=h.danger_level===o),c&&y&&f});a.sort((h,c)=>{let y=h[Ot]??"",f=c[Ot]??"";return typeof y=="number"&&typeof f=="number"?bt==="asc"?y-f:f-y:bt==="asc"?String(y).localeCompare(String(f)):String(f).localeCompare(String(y))});let i=a.length,r=Math.ceil(i/At)||1;D>r&&(D=r),D<1&&(D=1);let s=(D-1)*At,d=a.slice(s,s+At),l=document.getElementById("stockPageEnd");l&&(l.textContent=String(Math.min(s+At,i)));let u=document.getElementById("stockTotalCount");u&&(u.textContent=String(i));let p=document.getElementById("stockCurrentPageBadge");p&&(p.textContent=`${D}/${r}`);let m=document.getElementById("stockPrevBtn");m&&(m.disabled=D<=1);let b=document.getElementById("stockNextBtn");b&&(b.disabled=D>=r),ke(d)}function Yn(t){D+=t,z()}function Zn(t){Ot===t?bt=bt==="asc"?"desc":"asc":(Ot=t,bt="asc"),z()}function to(){let t=document.getElementById("fefoSearchInput");t&&(t.value="");let n=document.getElementById("fefoCategoryFilter");n&&(n.value="");let o=document.getElementById("fefoStatusFilter");o&&(o.value=""),D=1,z()}function eo(t){document.querySelectorAll(".stock-row-checkbox").forEach(o=>{o.checked=t;let e=o.dataset.sku;e&&(t?H.add(e):H.delete(e))}),ht()}function no(t,n){n?H.add(t):H.delete(t),ht()}function ht(){let t=document.getElementById("stockBulkActionBar"),n=document.getElementById("selectedStockCount");t&&(H.size>0?(t.classList.remove("hidden"),n&&(n.textContent=String(H.size))):t.classList.add("hidden"))}function oo(){H.clear();let t=document.getElementById("selectAllStockCheckbox");t&&(t.checked=!1),document.querySelectorAll(".stock-row-checkbox").forEach(n=>{n.checked=!1}),ht()}var Pt=null;async function jt(){try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",o=await(await fetch(`/api/stock?branch=${encodeURIComponent(t)}`)).json();if(o.success){typeof App<"u"&&(App.fefoItems=o.data||[]);let e=document.getElementById("fefoCategoryFilter"),a=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(e&&a.length){let i=e.value,r=Array.from(new Set(a.map(s=>s.category).filter(Boolean))).sort();e.innerHTML='<option value="">T\u1EA5t c\u1EA3 nh\xF3m h\xE0ng</option>'+r.map(s=>`<option value="${s}">${s}</option>`).join(""),i&&r.includes(i)&&(e.value=i)}z()}}catch(t){console.error("Error loading FEFO stock:",t)}}function ao(){let t=document.getElementById("modalFastReceipt");t&&t.classList.remove("hidden")}function ro(t,n,o,e){let a=document.getElementById("issueSku");a&&(a.value=t);let i=document.getElementById("issueBatchLabel");i&&(i.innerHTML=`<b>${t}</b> - ${n} <br>L\xF4: <b>${o}</b> (Kh\u1EA3 d\u1EE5ng: ${e})`);let r=document.getElementById("modalFastIssue");r&&r.classList.remove("hidden")}function yt(t){let n=document.getElementById(t);n&&n.classList.add("hidden")}async function so(){typeof showLoading=="function"&&showLoading("\u0110ang ghi nh\u1EADn nh\u1EADp kho...");try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",n=document.getElementById("recSku"),o=document.getElementById("recBatch"),e=document.getElementById("recMfg"),a=document.getElementById("recExp"),i=document.getElementById("recQty"),r=document.getElementById("recLoc"),s={branch_code:t,sku:n?n.value:"",batch_code:o&&o.value?o.value:"BAT-"+Date.now().toString().slice(-4),mfg_date:e?e.value:"",exp_date:a?a.value:"",qty:i?i.value:"0",storage_loc:r?r.value:""},l=await(await fetch("/api/stock/receipt",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(s)})).json();l.success?(yt("modalFastReceipt"),typeof showToast=="function"&&showToast("Nh\u1EADp kho l\xF4 m\u1EDBi th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),jt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+l.error)}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}async function io(){typeof showLoading=="function"&&showLoading("\u0110ang th\u1EF1c hi\u1EC7n xu\u1EA5t kho FEFO...");try{let t=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",n=document.getElementById("issueSku"),o=document.getElementById("issueQty"),e=document.getElementById("issueNote"),a={branch_code:t,sku:n?n.value:"",qty_needed:o?o.value:"0",note:e?e.value:""},r=await(await fetch("/api/stock/issue",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(a)})).json();r.success?(yt("modalFastIssue"),typeof showToast=="function"&&showToast("Xu\u1EA5t kho chu\u1EA9n FEFO th\xE0nh c\xF4ng!"),typeof loadDashboardSummary=="function"&&loadDashboardSummary(),jt()):typeof showToast=="function"&&showToast("L\u1ED7i: "+r.error)}catch(t){typeof showToast=="function"&&showToast("L\u1ED7i: "+t.message)}finally{typeof hideLoading=="function"&&hideLoading()}}function lo(t){let o=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(d=>d.sku===t);if(!o)return;let e=document.getElementById("editItemSku"),a=document.getElementById("editItemName"),i=document.getElementById("editItemSafetyStock"),r=document.getElementById("editItemUnit");e&&(e.value=o.sku),a&&(a.value=`${o.sku} - ${o.item_name}`),i&&(i.value=String(o.safety_stock||5)),r&&(r.value=o.unit||o.uom||"Can 5L");let s=document.getElementById("modalEditItem");s&&s.classList.remove("hidden")}function co(){let t=document.getElementById("editItemSku"),n=document.getElementById("editItemSafetyStock"),o=document.getElementById("editItemUnit"),e=t?t.value:"",a=n&&parseFloat(n.value)||5,i=o?o.value:"",s=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(d=>d.sku===e);s&&(s.safety_stock=a,s.unit=i),yt("modalEditItem"),typeof showToast=="function"&&showToast(`\u0110\xE3 c\u1EADp nh\u1EADt \u0111\u1ECBnh m\u1EE9c an to\xE0n cho ${e}!`),z()}async function uo(t){try{let n=document.getElementById("modalInventoryDetail");if(!n)return;n.classList.remove("hidden");let o=typeof App<"u"&&App.currentBranch?App.currentBranch:"ALL",a=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).find(c=>c.sku===t);if(!a){let y=await(await fetch(`/api/stock?branch=${encodeURIComponent(o)}`)).json();y.success&&y.data&&(a=y.data.find(f=>f.sku===t))}a||(a={sku:t,item_name:t,category:"Gia v\u1ECB",unit:"\u0110\u01A1n v\u1ECB",qty:12,safety_stock:5,standard_cost_sap:185e3,lead_time_hours:24});let i=document.getElementById("detailItemSku");i&&(i.textContent=a.sku);let r=document.getElementById("detailItemName");r&&(r.textContent=a.item_name||a.sku);let s=document.getElementById("detailItemUnit");s&&(s.textContent=a.unit||a.uom||"\u0110\u01A1n v\u1ECB");let d=document.getElementById("detailBadgeCategory");d&&(d.textContent=(a.sku.slice(0,2)||"GV").toUpperCase());let l=document.getElementById("detailQty");l&&(l.textContent=`${a.qty||0} ${a.unit||a.uom||""}`);let u=document.getElementById("detailSafetyStock");u&&(u.textContent=`${a.safety_stock||5} ${a.unit||a.uom||""}`);let p=document.getElementById("detailStandardCost");p&&(p.textContent=et(Number(a.standard_cost_sap)||185e3));let m=document.getElementById("detailLeadTime");m&&(m.textContent=`${a.lead_time_hours||24}h`);let b=document.getElementById("itemDetailStockChart");if(b&&typeof ApexCharts<"u"){Pt&&Pt.destroy();let c=typeof isDarkModeActive=="function"?isDarkModeActive():!1,f={series:[{name:"T\u1ED3n kho th\u1EF1c t\u1EBF",data:[15,14,16,12,11,14,13,15,14,12,typeof a.qty=="number"?a.qty:parseFloat(String(a.qty))||10]}],colors:["#19723C"],chart:{fontFamily:"'Be Vietnam Pro', sans-serif",type:"area",height:180,toolbar:{show:!1},sparkline:{enabled:!1}},dataLabels:{enabled:!1},stroke:{curve:"smooth",width:2.5},fill:{type:"gradient",gradient:{shadeIntensity:1,opacityFrom:.35,opacityTo:.05,stops:[0,95,100]}},xaxis:{categories:["09/11","10/11","11/11","12/11","13/11","14/11","15/11","16/11","17/11","18/11","19/11"],labels:{style:{colors:c?"#94A3B8":"#64748B",fontSize:"10px"}}},yaxis:{labels:{style:{colors:c?"#94A3B8":"#64748B",fontSize:"10px"}}},grid:{borderColor:c?"#1E293B":"#F1F5F9",strokeDashArray:3}};Pt=new ApexCharts(b,f),Pt.render()}let h=document.getElementById("detailTransactionsBody");h&&(h.innerHTML=`
        <tr>
          <td colspan="5" class="py-6 text-center text-gray-400 dark:text-gray-500 text-xs">
            Ch\u01B0a c\xF3 ph\xE1t sinh giao d\u1ECBch cho m\u1EB7t h\xE0ng n\xE0y.
          </td>
        </tr>
      `),typeof lucide<"u"&&lucide.createIcons&&lucide.createIcons()}catch(n){console.error("Error opening item detail:",n)}}function go(t,n,o){let a=[["\u01AFu Ti\xEAn FEFO","M\xE3 SKU","T\xEAn M\u1EB7t H\xE0ng","M\xE3 L\xF4","H\u1EA1n D\xF9ng (EXP)","S\u1ED1 L\u01B0\u1EE3ng T\u1ED3n","\u0110\u01A1n V\u1ECB","S\u1ED1 Ng\xE0y C\xF2n","Tr\u1EA1ng Th\xE1i"]];o.forEach(d=>{let l=d.fefo_priority??1,u=d.sku||"",p=d.item_name||"",m=mt(d),b=d.exp_date?d.exp_date.slice(0,10):"\u2014",h=dt(d.qty),c=ft(d),y=d.days_remaining!==void 0?d.days_remaining:d.days_left!==void 0?d.days_left:45,f=d.status_text||"An to\xE0n";a.push([l,u,p,m,b,h,c,y,f])});let i=XLSX.utils.book_new(),r=XLSX.utils.aoa_to_sheet(a),s=XLSX.utils.decode_range(r["!ref"]);r["!cols"]=[{wch:14},{wch:14},{wch:34},{wch:16},{wch:16},{wch:14},{wch:10},{wch:14},{wch:16}];for(let d=s.s.r;d<=s.e.r;++d)for(let l=s.s.c;l<=s.e.c;++l){let u=XLSX.utils.encode_cell({r:d,c:l});if(r[u])if(d===0)r[u].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let p="left",m;l===0||l===1||l===3||l===4||l===6||l===8?p="center":(l===5||l===7)&&(p="right",l===5&&(m="#,##0.00"),l===7&&(m="#,##0"));let b=l===5&&typeof r[u].v=="number"&&r[u].v<0;r[u].s={font:{name:"Aptos",sz:11,bold:!1,color:{rgb:b?"C00000":"000000"}},alignment:{horizontal:p,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},m&&(r[u].z=m)}}r["!freeze"]={xSplit:0,ySplit:1},r["!autofilter"]={ref:r["!ref"]},XLSX.utils.book_append_sheet(i,r,n),XLSX.writeFile(i,t)}function po(){let t=typeof App<"u"&&App.fefoItems?App.fefoItems:[];if(!t||!t.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u t\u1ED3n kho \u0111\u1EC3 xu\u1EA5t Excel!");return}go("Danh_Sach_Ton_Kho_FEFO.xlsx","TonKhoFEFO",t)}function mo(){if(H.size===0){typeof showToast=="function"&&showToast("Vui l\xF2ng ch\u1ECDn \xEDt nh\u1EA5t 1 m\u1EB7t h\xE0ng \u0111\u1EC3 xu\u1EA5t Excel!");return}let n=(typeof App<"u"&&App.fefoItems?App.fefoItems:[]).filter(o=>H.has(o.sku));go("Ton_Kho_Duoc_Chon.xlsx","DuocChon",n)}if(typeof window<"u"){let t=window;t.renderFefoRows=ke,t.filterFefoLive=z,t.changeStockPage=Yn,t.sortStockBy=Zn,t.resetFefoFilters=to,t.toggleSelectAllStock=eo,t.toggleStockItemSelect=no,t.updateStockBulkBar=ht,t.clearStockSelection=oo,t.selectedStockSkus=H,t.getSelectedStockSkus=Qn,t.getStockCurrentPage=Jn,t.setStockCurrentPage=zn,t.loadStockFEFO=jt,t.openReceiptModal=ao,t.openIssueModal=ro,t.closeModal=yt,t.submitReceiptToBackend=so,t.submitIssueToBackend=io,t.openEditItemModal=lo,t.saveItemSpecs=co,t.openItemDetailModal=uo,t.exportFefoToExcel=po,t.exportSelectedStockExcel=mo}function Le(t){let n=document.getElementById("ropTableBody"),o=document.getElementById("ropMobileCards");if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="9" class="p-8 text-center text-emerald-600 dark:text-emerald-400 font-medium">T\u1EA5t c\u1EA3 m\u1EB7t h\xE0ng t\u1EA1i \u0111i\u1EC3m kho n\xE0y \u0111\u1EC1u \u0111\u1EA1t ng\u01B0\u1EE1ng t\u1ED3n an to\xE0n (Kh\xF4ng c\u1EA7n \u0111\u1EB7t th\xEAm).</td></tr>'),o&&(o.innerHTML='<div class="p-6 text-center text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl border border-emerald-200 dark:border-emerald-800">T\u1EA5t c\u1EA3 m\u1EB7t h\xE0ng t\u1EA1i \u0111i\u1EC3m kho n\xE0y \u0111\u1EC1u \u0111\u1EA1t ng\u01B0\u1EE1ng t\u1ED3n an to\xE0n.</div>');return}n&&(n.innerHTML=t.map(e=>{let a=e.sku||"",i=e.item_name||a,r=e.unit||e.uom||"Ph\u1EA7n",s=parseFloat(String(e.daily_usage!==void 0?e.daily_usage:10)),d=e.lead_time_days!==void 0?parseFloat(String(e.lead_time_days)):e.lead_time_hours?Math.round(parseFloat(String(e.lead_time_hours))/24):2,l=parseFloat(String(e.safety_stock!==void 0?e.safety_stock:5)),u=parseFloat(String(e.current_stock!==void 0?e.current_stock:0)),p=parseFloat(String(e.rop!==void 0?e.rop:e.rop_threshold!==void 0?e.rop_threshold:25)),m=parseFloat(String(e.suggested_order!==void 0?e.suggested_order:e.suggested_order_qty!==void 0?e.suggested_order_qty:u<p?Math.max(0,35-u):0)),b=e.status||(u<=0?"H\u1EBET H\xC0NG":u<p?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N"),h="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold";return b==="H\u1EBET H\xC0NG"?h="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-bold":b==="C\u1EA6N \u0110\u1EB6T"&&(h="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold animate-pulse"),`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 text-center font-mono tabular-nums font-bold text-gray-800 dark:text-gray-200 text-xs">${a}</td>
          <td class="p-3 font-semibold text-gray-900 dark:text-white text-xs">${i}</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${B(s,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${d} ng\xE0y</td>
          <td class="p-3 text-right font-mono tabular-nums text-gray-700 dark:text-gray-300 text-xs">${B(l,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${u<=0?"text-rose-600":"text-gray-900 dark:text-white"} text-xs">${B(u,1)} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold text-amber-600 dark:text-amber-400 text-xs">${B(p,1)} <span class="text-[11px] text-amber-600/70 font-sans">${r}</span></td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${m>0?"text-brand-600 dark:text-brand-400":"text-gray-400"} text-xs">${m>0?"+"+B(m,1):"0"} <span class="text-[11px] text-gray-400 font-sans">${r}</span></td>
          <td class="p-3 text-center">
            <span class="px-2.5 py-0.5 rounded-full text-[11px] ${h}">${b}</span>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(e=>{let a=e.sku||"",i=e.item_name||a,r=e.unit||e.uom||"Ph\u1EA7n",s=e.lead_time_days!==void 0?parseFloat(String(e.lead_time_days)):e.lead_time_hours?Math.round(parseFloat(String(e.lead_time_hours))/24):2,d=parseFloat(String(e.current_stock!==void 0?e.current_stock:0)),l=parseFloat(String(e.rop!==void 0?e.rop:e.rop_threshold!==void 0?e.rop_threshold:25)),u=parseFloat(String(e.suggested_order!==void 0?e.suggested_order:e.suggested_order_qty!==void 0?e.suggested_order_qty:d<l?Math.max(0,35-d):0)),p=e.status||(d<=0?"H\u1EBET H\xC0NG":d<l?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N"),m="bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200";return p==="H\u1EBET H\xC0NG"?m="bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200":p==="C\u1EA6N \u0110\u1EB6T"&&(m="bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200"),`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-xs text-gray-900 dark:text-white">${i}</div>
              <div class="text-[11px] font-mono text-gray-400 mt-0.5">SKU: ${a}</div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${m}">${p}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>T\u1ED3n hi\u1EC7n t\u1EA1i: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${B(d,1)} ${r}</b></div>
            <div>\u0110i\u1EC3m ROP: <b class="font-mono tabular-nums text-amber-600 dark:text-amber-400">${B(l,1)} ${r}</b></div>
            <div>Lead time: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${s} ng\xE0y</b></div>
            <div>\u0110\u1EC1 xu\u1EA5t \u0111\u1EB7t: <b class="font-mono tabular-nums font-semibold text-sm ${u>0?"text-brand-600 dark:text-brand-400":"text-gray-500"}">${u>0?"+"+B(u,1):"0"} ${r}</b></div>
          </div>
        </div>
      `}).join(""))}async function fo(){let t=localStorage.getItem("orbit_user_site"),n=document.getElementById("globalBranchSelect")?.value,o=typeof App<"u"&&App.currentBranch?App.currentBranch.toUpperCase():null,e=t||n||o||"K001";(e==="ALL"||e==="all")&&(e="K001"),e=e.toUpperCase();let a=document.getElementById("whRopCurrentSiteBadge");if(a){let d=(typeof window.getAppSitesList=="function"?window.getAppSitesList():[]).find(l=>l.code&&l.code.toUpperCase()===e.toUpperCase());a.textContent=d?d.ten||d.name:e}let i=document.getElementById("ropTableBody"),r=document.getElementById("ropMobileCards");i&&(i.innerHTML='<tr><td colspan="9" class="p-8 text-center text-gray-400">\u0110ang t\xEDnh to\xE1n ng\u01B0\u1EE1ng an to\xE0n ROP...</td></tr>'),r&&(r.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">\u0110ang t\xEDnh to\xE1n ng\u01B0\u1EE1ng an to\xE0n ROP...</div>');try{let d=await(await fetch(`/api/reorder?site=${encodeURIComponent(e)}&branch=${encodeURIComponent(e)}&nocache=1`)).json();if(d.success){let l=d.data||[];typeof App<"u"&&(App.ropItems=l),Le(l)}else i&&(i.innerHTML=`<tr><td colspan="9" class="p-8 text-center text-rose-500">L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u: ${d.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</td></tr>`),r&&(r.innerHTML=`<div class="p-6 text-center text-rose-500 bg-rose-50 dark:bg-rose-950/20 rounded-2xl">L\u1ED7i: ${d.error||"Kh\xF4ng x\xE1c \u0111\u1ECBnh"}</div>`)}catch(s){console.error("loadReorderROP error:",s),i&&(i.innerHTML=`<tr><td colspan="9" class="p-8 text-center text-rose-500">L\u1ED7i k\u1EBFt n\u1ED1i: ${s.message}</td></tr>`)}}function Vt(t){let n=document.getElementById("leadTimeTableBody"),o=document.getElementById("leadTimeMobileCards");if(!t||!t.length){n&&(n.innerHTML='<tr><td colspan="7" class="p-8 text-center text-gray-400">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n PO n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 K\u1EF3 th\xE1ng \u0111\xE3 ch\u1ECDn.</td></tr>'),o&&(o.innerHTML='<div class="p-8 text-center text-gray-400 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-gray-800">Kh\xF4ng t\xECm th\u1EA5y \u0111\u01A1n PO n\xE0o ph\xF9 h\u1EE3p v\u1EDBi Site v\xE0 K\u1EF3 th\xE1ng \u0111\xE3 ch\u1ECDn.</div>');return}n&&(n.innerHTML=t.map(e=>{let a=e.supplier_name||e.vendor_name||"B\u1EBFp Trung T\xE2m Siba Food",i=e.order_date||(e.order_time?e.order_time.split(" ")[0]:"\u2014"),r=e.actual_delivery_date||(e.received_time?e.received_time.split(" ")[0]:"\u2014"),s=e.actual_lead_time_days!==null&&e.actual_lead_time_days!==void 0?e.actual_lead_time_days+" ng\xE0y":e.lead_time_hours?e.lead_time_hours+"h":"\u2014",d=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N"),l=d==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA",u=d==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao",p=l?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200":u?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200":"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200";return`
        <tr class="hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors">
          <td class="p-3 font-mono tabular-nums font-bold text-gray-900 dark:text-white">${e.po_number}</td>
          <td class="p-3 font-mono tabular-nums font-bold text-brand-600 dark:text-brand-400">
            <span class="px-2 py-0.5 rounded bg-brand-50 dark:bg-brand-950/40 border border-brand-200/60 dark:border-brand-800/60">${e.branch_code||e.site||"\u2014"}</span>
          </td>
          <td class="p-3 font-bold text-gray-800 dark:text-gray-200">${a}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${i}</td>
          <td class="p-3 font-mono tabular-nums text-gray-600 dark:text-gray-300">${r}</td>
          <td class="p-3 text-right font-mono tabular-nums font-bold ${!l&&!u?"text-rose-600":"text-emerald-600"}">${s}</td>
          <td class="p-3 text-center">
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${p}">${d}</span>
          </td>
        </tr>
      `}).join("")),o&&(o.innerHTML=t.map(e=>{let a=e.supplier_name||e.vendor_name||"B\u1EBFp Trung T\xE2m Siba Food",i=e.order_date||(e.order_time?e.order_time.split(" ")[0]:"\u2014"),r=e.actual_delivery_date||(e.received_time?e.received_time.split(" ")[0]:"\u2014"),s=e.committed_lead_time_days?e.committed_lead_time_days+" ng\xE0y":e.sla_target_hours?e.sla_target_hours+"h":"24h",d=e.actual_lead_time_days!==null&&e.actual_lead_time_days!==void 0?e.actual_lead_time_days+" ng\xE0y":e.lead_time_hours?e.lead_time_hours+"h":"\u2014",l=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N"),u=l==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA",p=l==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao",m=u?"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200":p?"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200":"bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200";return`
        <div class="bg-white dark:bg-white/3 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-theme-xs space-y-2.5">
          <div class="flex items-center justify-between">
            <div>
              <div class="font-bold text-xs text-gray-900 dark:text-white">${a}</div>
              <div class="text-xs font-mono tabular-nums text-gray-400">PO: ${e.po_number} \xB7 \u0110i\u1EC3m: <b class="text-brand-600 dark:text-brand-400">${e.branch_code||e.site||"\u2014"}</b></div>
            </div>
            <span class="px-2 py-0.5 rounded-full text-xs font-bold ${m}">${l}</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-400">
            <div>Ng\xE0y \u0111\u1EB7t: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${i}</b></div>
            <div>Ng\xE0y nh\u1EADn: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${r}</b></div>
            <div>Cam k\u1EBFt SLA: <b class="font-mono tabular-nums text-gray-900 dark:text-white">${s}</b></div>
            <div>Lead time th\u1EF1c t\u1EBF: <b class="font-mono tabular-nums font-bold ${!u&&!p?"text-rose-600":"text-emerald-600"}">${d}</b></div>
          </div>
        </div>
      `}).join(""))}function Se(t){let n=typeof App<"u"&&App.leadTimeRawData?App.leadTimeRawData:[];if(!t||t==="ALL"){Vt(n);return}let o=n.filter(e=>{let a=e.status||(e.sla_status==="\u0110\u1EA1t SLA"?"\u0110\xDANG H\u1EA0N":"TR\u1EC4 H\u1EA0N");return t==="ON_TIME"?a==="\u0110\xDANG H\u1EA0N"||e.sla_status==="\u0110\u1EA1t SLA":t==="DELIVERING"?a==="\u0110ANG GIAO"||e.sla_status==="Ch\u1EDD giao":t==="LATE"?a==="TR\u1EC4 H\u1EA0N"||e.sla_status==="Tr\u1EC5 h\u1EB9n NCC":!0});Vt(o)}async function bo(){let t=document.getElementById("globalBranchSelect")?.value,o=((typeof App<"u"&&App.currentBranch?App.currentBranch:"")||t||"").toUpperCase(),e=document.getElementById("leadTimeMonth")?.value||"",a=new URLSearchParams;o&&o!=="ALL"&&a.set("site",o),e&&a.set("month",e);let i=a.toString()?`/api/leadtime?${a.toString()}`:"/api/leadtime";try{let s=await(await fetch(i)).json(),d=s.success&&s.data?s.data:[];typeof App<"u"&&(App.leadTimeRawData=d);let l=document.getElementById("leadTimeSlaFilter")?.value||"ALL";Se(l)}catch(r){console.error("Error loading Lead Time:",r)}}function ho(){let t=typeof App<"u"&&App.ropItems?App.ropItems:[];if(!t||!t.length){typeof showToast=="function"&&showToast("Ch\u01B0a c\xF3 d\u1EEF li\u1EC7u c\u1EA3nh b\xE1o ROP \u0111\u1EC3 xu\u1EA5t Excel!");return}let o=[["M\xE3 SKU","T\xEAn Gia V\u1ECB / M\u1EB7t H\xE0ng","\u0110VT","Ti\xEAu Th\u1EE5/Ng\xE0y","Lead Time (ng\xE0y)","T\u1ED3n An To\xE0n","T\u1ED3n Hi\u1EC7n T\u1EA1i","Ng\u01B0\u1EE1ng ROP","\u0110\u1EC1 Xu\u1EA5t \u0110\u1EB7t","Tr\u1EA1ng Th\xE1i"]];t.forEach(r=>{let s=r.sku||"",d=r.item_name||s,l=r.unit||r.uom||"Ph\u1EA7n",u=parseFloat(String(r.daily_usage!==void 0?r.daily_usage:10)),p=r.lead_time_days!==void 0?parseFloat(String(r.lead_time_days)):r.lead_time_hours?Math.round(parseFloat(String(r.lead_time_hours))/24):2,m=parseFloat(String(r.safety_stock!==void 0?r.safety_stock:5)),b=parseFloat(String(r.current_stock!==void 0?r.current_stock:0)),h=parseFloat(String(r.rop!==void 0?r.rop:r.rop_threshold!==void 0?r.rop_threshold:25)),c=parseFloat(String(r.suggested_order!==void 0?r.suggested_order:r.suggested_order_qty!==void 0?r.suggested_order_qty:b<h?Math.max(0,35-b):0)),y=r.status||(b<=0?"H\u1EBET H\xC0NG":b<h?"C\u1EA6N \u0110\u1EB6T":"AN TO\xC0N");o.push([s,d,l,u,p,m,b,h,c,y])});let e=XLSX.utils.book_new(),a=XLSX.utils.aoa_to_sheet(o),i=XLSX.utils.decode_range(a["!ref"]);a["!cols"]=[{wch:14},{wch:34},{wch:10},{wch:14},{wch:16},{wch:14},{wch:14},{wch:14},{wch:14},{wch:16}];for(let r=i.s.r;r<=i.e.r;++r)for(let s=i.s.c;s<=i.e.c;++s){let d=XLSX.utils.encode_cell({r,c:s});if(a[d])if(r===0)a[d].s={font:{name:"Aptos",sz:11,bold:!0,color:{rgb:"FFFFFF"}},fill:{fgColor:{rgb:"1F4E79"}},alignment:{horizontal:"center",vertical:"center",wrapText:!0},border:{top:{style:"thin",color:{rgb:"D0D5DD"}},bottom:{style:"medium",color:{rgb:"0F2842"}},left:{style:"thin",color:{rgb:"D0D5DD"}},right:{style:"thin",color:{rgb:"D0D5DD"}}}};else{let l="left",u;s===0||s===2||s===9?l="center":s>=3&&s<=8&&(l="right",u="#,##0.0",(s===4||s===8)&&(u="#,##0"));let p=s===6&&typeof a[d].v=="number"&&a[d].v<=0;a[d].s={font:{name:"Aptos",sz:11,bold:s===6||s===8,color:{rgb:p?"C00000":"000000"}},alignment:{horizontal:l,vertical:"center"},border:{top:{style:"thin",color:{rgb:"E4E7EC"}},bottom:{style:"thin",color:{rgb:"E4E7EC"}},left:{style:"thin",color:{rgb:"E4E7EC"}},right:{style:"thin",color:{rgb:"E4E7EC"}}}},u&&(a[d].z=u)}}a["!freeze"]={xSplit:0,ySplit:1},a["!autofilter"]={ref:a["!ref"]},XLSX.utils.book_append_sheet(e,a,"ROP"),XLSX.writeFile(e,"De_Xuat_Dat_Hang_ROP.xlsx")}if(typeof window<"u"){let t=window;t.loadReorderROP=fo,t.renderRopTable=Le,t.loadLeadTime=bo,t.renderLeadTimeTable=Vt,t.filterLeadTimeSla=Se,t.downloadRopExcel=ho}console.log("A.Kitchen WMS TypeScript Core v1.0 initialized.");export{Ft as STANDARD_STEPS,jn as addEditOrderItemLine,Ve as addManualReceiptItem,Et as addWasteLineRow,$o as api,pt as calcBudget,Bt as canAuthenticateJourney,K as canDeleteOrders,X as canEditOrders,Yn as changeStockPage,oo as clearStockSelection,Yt as closeConfirmClearManualLinesModal,Kt as closeCreateReceiptModal,ne as closeCreateWasteModal,Rt as closeDeleteOrderModal,he as closeEditOrderModal,vn as closeInvDetailModal,Qt as closeManualReceiptModal,yt as closeModal,Dn as closeOrderJourneyModal,zt as confirmClearAllManualReceiptLines,Wn as confirmDeleteOrder,Nn as currentJourneyData,Hn as currentJourneyOrderCode,Io as debounce,ho as downloadRopExcel,_ as editOrderItems,g as escapeHtml,Qe as executeClearAllManualReceiptLines,qn as executeDeleteOrder,kn as exportCountSheetExcel,po as exportFefoToExcel,Mt as exportFnbStockExcel,mo as exportSelectedStockExcel,z as filterFefoLive,fe as filterHsOrders,En as filterItems,Se as filterLeadTimeSla,Z as filterManualCatalogList,mt as formatBatchCode,qt as formatCompactVND,Te as formatDate,To as formatDateYMD,ve as formatItemQty,B as formatNumber,Q as formatReceiptDateYMD,ft as formatUnit,et as formatVND,j as gFnbStockData,$ as gFnbStockFilter,$t as gFnbStockSearchTerm,W as getActiveFnbCountSite,A as getActiveFnbReceiptSite,O as getActiveFnbWasteSite,q as getAppItems,xe as getDangerBadgeClass,Xn as getDaysRemainingMobileText,Gn as getDaysRemainingText,we as getDaysTextColor,Un as getExpBadgeClass,Kn as getExpDateColor,F as getReceiptExpWarningHtml,Qn as getSelectedStockSkus,Jn as getStockCurrentPage,Ka as handleExportFnbStockExcel,wo as loadFnbCounts,re as loadFnbCountsHistory,J as loadFnbPoList,Ie as loadFnbReceipts,Re as loadFnbReceiptsHistory,se as loadFnbStock,xo as loadFnbWaste,te as loadFnbWasteHistory,_n as loadHistory,bo as loadLeadTime,ct as loadManualCatalogItems,ue as loadQuota,fo as loadReorderROP,jt as loadStockFEFO,Ct as loadWasteModalItems,hn as onCountInputChange,yn as onCountNoteChange,mn as onFnbCountDateChange,gn as onFnbCountFilterChange,un as onFnbCountNganhHangChange,pn as onFnbCountSearch,fn as onFnbCountSiteChange,Me as onFnbPoSearchInput,Ln as onFnbStockFilterChange,Sn as onFnbStockSearch,Cn as onFnbStockToggleValue,Ze as onFnbWasteFilterChange,Ye as onFnbWasteNganhHangChange,tn as onFnbWasteSearch,en as onFnbWasteSiteChange,Ue as onManualLineBatchChange,Ge as onManualLineExpChange,Ke as onManualLineLocChange,qe as onManualLinePriceChange,We as onManualLineQtyChange,Pe as onManualReceiptSiteChange,Tn as onQtyChange,_e as onReceiptLineBatchChange,Be as onReceiptLineExpChange,Ne as onReceiptLineNoteChange,$e as onReceiptLineQtyChange,an as onWasteLineNoteChange,nn as onWasteLineQtyChange,on as onWasteLineReasonChange,ln as onWasteModalItemSelect,oe as onWasteModalLineQtyInput,dn as onWasteModalSiteChange,Fe as openCreateReceiptModal,sn as openCreateWasteModal,lo as openEditItemModal,An as openEditOrderModal,ro as openIssueModal,uo as openItemDetailModal,Oe as openManualReceiptModal,Fn as openOrderJourneyModal,Gt as openPoReceiptModal,ao as openReceiptModal,dt as parseQty,be as pendingDeleteOrderCode,Tt as populateFnbCountFilters,It as populateFnbCountNhomHangDropdown,ee as populateFnbWasteFilters,Lt as populateFnbWasteNhomHangDropdown,Zt as populateFnbWasteSiteDropdown,ye as recalcEditOrderTotals,ae as recalculateWasteModalTotal,Pn as removeEditOrderItemLine,Jt as removeManualReceiptLine,it as renderEditOrderItems,ke as renderFefoRows,P as renderFnbCountsTable,vt as renderFnbPoTable,ut as renderFnbStock,rt as renderFnbWasteStockTable,Nt as renderHsOrdersList,Ht as renderJourneyBadge,Dt as renderJourneyTimeline,Vt as renderLeadTimeTable,ot as renderManualReceiptLinesTable,gt as renderOrderTable,Xt as renderReceiptLinesTable,Le as renderRopTable,to as resetFefoFilters,In as reviewOrder,Vn as saveEditOrder,xn as saveFnbCountAudit,co as saveItemSpecs,H as selectedStockSkus,_t as setAppItems,Xe as setManualLineQuickExp,He as setReceiptLineQuickExp,zn as setStockCurrentPage,Zn as sortStockBy,De as submitCreateReceipt,cn as submitCreateWaste,rn as submitDirectWaste,io as submitIssueToBackend,Rn as submitJourneyStep,Je as submitManualReceipt,Mn as submitOrder,so as submitReceiptToBackend,nt as switchFnbReceiptSubView,at as switchFnbWasteSubView,bn as toggleBlindCount,je as toggleManualShowAllCatalog,eo as toggleSelectAllStock,no as toggleStockItemSelect,On as updateEditOrderItemQty,kt as updateManualTotals,ht as updateStockBulkBar,St as updateWasteKPIs,wn as viewCountDetail,Bn as viewOrderDetail,Ae as viewReceiptDetail,ze as viewWasteDetail};
