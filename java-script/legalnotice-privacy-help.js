
function goToLastPage() {
    history.back();
}

document.addEventListener('DOMContentLoaded', function() {
    const referrer = document.referrer;
    if (!referrer.includes('login.html')) {
        if (typeof loadTemplates === 'function') {
            loadTemplates();
        }
    }
});

