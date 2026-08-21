/**
 * CƠ KHÍ VIRAL — COMPANY PROFILE 3D FLIPBOOK CONTROLLER
 * Vanilla JS 3D Page Turning Engine
 */

document.addEventListener('DOMContentLoaded', () => {
    // References to DOM Elements
    const prevBtn = document.querySelector("#prev-btn");
    const nextBtn = document.querySelector("#next-btn");
    const book = document.querySelector("#book");
    const pageDisplay = document.querySelector("#page-display");

    const papers = [
        document.querySelector("#p1"),
        document.querySelector("#p2"),
        document.querySelector("#p3"),
        document.querySelector("#p4"),
        document.querySelector("#p5")
    ];

    // Event Listeners
    prevBtn.addEventListener("click", goPrevPage);
    nextBtn.addEventListener("click", goNextPage);

    // Click on page faces to turn
    papers.forEach((paper, index) => {
        const frontFace = paper.querySelector(".front");
        const backFace = paper.querySelector(".back");

        frontFace.addEventListener("click", () => {
            if (currentLocation === index + 1) {
                goNextPage();
            }
        });

        backFace.addEventListener("click", () => {
            if (currentLocation === index + 2) {
                goPrevPage();
            }
        });
    });

    // Keyboard Navigation
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft" || e.key === "PageUp") {
            goPrevPage();
        } else if (e.key === "ArrowRight" || e.key === "PageDown") {
            goNextPage();
        }
    });

    // Business Logic
    let currentLocation = 1;
    const maxLocation = papers.length + 1; // Cover, Spreads, Back Cover

    function updatePageDisplay() {
        if (currentLocation === 1) {
            pageDisplay.textContent = "Bìa Trước / 10";
        } else if (currentLocation === maxLocation) {
            pageDisplay.textContent = "Bìa Sau / 10";
        } else {
            const leftPage = (currentLocation - 1) * 2;
            const rightPage = leftPage + 1;
            pageDisplay.textContent = `Trang ${String(leftPage).padStart(2, '0')} - ${String(rightPage).padStart(2, '0')} / 10`;
        }
    }

    function openBook() {
        if (window.innerWidth > 768) {
            book.style.transform = "translateX(0%)";
        }
    }

    function closeBook(isAtBeginning) {
        if (window.innerWidth > 768) {
            if (isAtBeginning) {
                book.style.transform = "translateX(50%)";
            } else {
                book.style.transform = "translateX(-50%)";
            }
        }
    }

    function goNextPage() {
        if (currentLocation < maxLocation) {
            const activePaper = papers[currentLocation - 1];
            activePaper.classList.add("flipped");
            
            // Manage z-index order as pages flip over to the left
            setTimeout(() => {
                activePaper.style.zIndex = currentLocation;
            }, 100);

            currentLocation++;
            
            if (currentLocation === 2) {
                openBook();
            }
            if (currentLocation === maxLocation) {
                closeBook(false);
            }
            
            updatePageDisplay();
        }
    }

    function goPrevPage() {
        if (currentLocation > 1) {
            currentLocation--;
            const activePaper = papers[currentLocation - 1];
            activePaper.classList.remove("flipped");
            
            // Restore original z-index hierarchy
            const originalZIndex = papers.length - currentLocation + 1;
            activePaper.style.zIndex = originalZIndex;

            if (currentLocation === 1) {
                closeBook(true);
            }
            if (currentLocation === papers.length) {
                openBook();
            }

            updatePageDisplay();
        }
    }

    // Initialize display
    updatePageDisplay();

    // Reset layout on window resize to prevent alignment bugs
    window.addEventListener("resize", () => {
        if (window.innerWidth <= 768) {
            book.style.transform = "none";
            papers.forEach(p => {
                p.style.zIndex = "";
                p.style.transform = "";
            });
        } else {
            if (currentLocation === 1) {
                closeBook(true);
            } else if (currentLocation === maxLocation) {
                closeBook(false);
            } else {
                openBook();
            }
            
            // Re-apply correct z-indices
            papers.forEach((paper, idx) => {
                if (idx < currentLocation - 1) {
                    paper.style.zIndex = idx + 1;
                } else {
                    paper.style.zIndex = papers.length - idx;
                }
            });
        }
    });
});
