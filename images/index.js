document.addEventListener('DOMContentLoaded', () => {
    // --- Global Setup ---
    const isMobile = window.innerWidth <= 768;
    const taskbarItems = document.querySelectorAll('.taskbar-item');
    const startBtn = document.querySelector('.start-btn');
    const startMenu = document.getElementById('start-menu');
    let highestZIndex = 1;

    function openWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
        if (windowElement) {
            windowElement.classList.remove('hidden');
            if (taskbarItem) taskbarItem.classList.add('active');
            highestZIndex++;
            windowElement.style.zIndex = highestZIndex;
        }
    }

    function closeWindow(windowId) {
        const windowElement = document.getElementById(windowId);
        const taskbarItem = document.querySelector(`.taskbar-item[data-window="${windowId}"]`);
        if (windowElement) {
            windowElement.classList.add('hidden');
            if (taskbarItem) taskbarItem.classList.remove('active');
        }
    }

    taskbarItems.forEach(item => {
        item.addEventListener('click', () => openWindow(item.dataset.window));
    });

    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeWindow(btn.dataset.window);
        });
    });

    startBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        startMenu.classList.toggle('hidden');
        startBtn.classList.toggle('active');
    });

    document.querySelectorAll('.start-menu-items li[data-window]').forEach(item => {
        item.addEventListener('click', () => {
            openWindow(item.dataset.window);
            startMenu.classList.add('hidden');
            startBtn.classList.remove('active');
        });
    });
    
    document.getElementById('shutdown-btn').addEventListener('click', () => {
        alert("It's not safe to shut down now!");
        startMenu.classList.add('hidden');
        startBtn.classList.remove('active');
    });

    document.addEventListener('click', (e) => {
        if (!startMenu.contains(e.target) && !startBtn.contains(e.target)) {
            startMenu.classList.add('hidden');
            startBtn.classList.remove('active');
        }
    });

    if (!isMobile) {
        document.querySelectorAll('.window').forEach(windowEl => {
            makeDraggable(windowEl);
            makeResizable(windowEl);
        });
    }

    function makeDraggable(windowElement) {
        const titleBar = windowElement.querySelector('.title-bar');
        let isDragging = false, offsetX, offsetY;
        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - windowElement.getBoundingClientRect().left;
            offsetY = e.clientY - windowElement.getBoundingClientRect().top;
            highestZIndex++;
            windowElement.style.zIndex = highestZIndex;
            document.body.style.cursor = 'grabbing';
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            windowElement.style.left = `${e.clientX - offsetX}px`;
            windowElement.style.top = `${e.clientY - offsetY}px`;
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.cursor = 'default';
        });
    }

    function makeResizable(windowElement) {
        const resizeHandle = windowElement.querySelector('.resize-handle');
        let isResizing = false;
        resizeHandle.addEventListener('mousedown', (e) => {
            e.stopPropagation(); isResizing = true;
            let startX = e.clientX, startY = e.clientY;
            let startWidth = parseInt(document.defaultView.getComputedStyle(windowElement).width, 10);
            let startHeight = parseInt(document.defaultView.getComputedStyle(windowElement).height, 10);
            
            function onMouseMove(e) {
                if (!isResizing) return;
                windowElement.style.width = `${startWidth + e.clientX - startX}px`;
                windowElement.style.height = `${startHeight + e.clientY - startY}px`;
            }
            function onMouseUp() {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    const clockElement = document.getElementById('clock');
    function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12; hours = hours ? hours : 12;
        clockElement.textContent = `${hours}:${minutes} ${ampm}`;
    }
    setInterval(updateClock, 1000);
    updateClock();
});