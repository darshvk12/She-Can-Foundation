
        let currentUser = null;
        let allUsers = [];

        // Sample user data (simulating your JSON data)
        const userData = [
            {
                "name": "Intern A",
                "email": "interna@example.com",
                "referral_code": "internA2025",
                "total_donations": 1200
            },
            {
                "name": "Intern B",
                "email": "internb@example.com",
                "referral_code": "internB2025",
                "total_donations": 3500
            },
            {
                "name": "Intern C",
                "email": "internc@example.com",
                "referral_code": "internC2025",
                "total_donations": 2700
            }
        ];

        // Initialize the app
        function initializeApp() {
            allUsers = userData.map((user, index) => ({
                ...user,
                donors: Math.floor(user.total_donations / 50),
                rank: 0 // Will be calculated based on donations
            }));

            // Sort users by donations and assign ranks
            allUsers.sort((a, b) => b.total_donations - a.total_donations);
            allUsers.forEach((user, index) => {
                user.rank = index + 1;
            });

            console.log('ImpactHub loaded! Try login or signup.');
        }

        function switchToLogin() {
            document.querySelector('.auth-tab.active').classList.remove('active');
            document.querySelectorAll('.auth-tab')[0].classList.add('active');
            document.getElementById('loginSection').classList.add('active');
            document.getElementById('signupSection').classList.remove('active');
        }

        function switchToSignup() {
            document.querySelector('.auth-tab.active').classList.remove('active');
            document.querySelectorAll('.auth-tab')[1].classList.add('active');
            document.getElementById('signupSection').classList.add('active');
            document.getElementById('loginSection').classList.remove('active');
        }

        function handleLogin() {
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            if (!email || !password) {
                alert('Please enter both email and password');
                return;
            }

            // Find user by email
            const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
            
            if (user) {
                currentUser = user;
                showDashboard();
            } else {
                alert('User not found. Please check your email or create a new account.');
            }
        }

        function handleSignup() {
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            
            if (!name || !email || !password) {
                alert('Please fill in all fields');
                return;
            }

            // Check if user already exists
            if (allUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
                alert('User with this email already exists. Please sign in instead.');
                return;
            }

            // Create new user
            const firstName = name.split(' ')[0];
            const newUser = {
                name: name,
                email: email,
                referral_code: firstName.toUpperCase() + '2025',
                total_donations: Math.floor(Math.random() * 2000) + 500,
                donors: Math.floor(Math.random() * 20) + 5,
                rank: allUsers.length + 1
            };

            allUsers.push(newUser);
            
            // Recalculate ranks
            allUsers.sort((a, b) => b.total_donations - a.total_donations);
            allUsers.forEach((user, index) => {
                user.rank = index + 1;
            });

            currentUser = newUser;
            showDashboard();
        }

        function showDashboard() {
            document.getElementById('authContainer').style.display = 'none';
            document.getElementById('dashboard').classList.add('active');
            document.getElementById('logoutSection').style.display = 'block';
            
            // Update user info
            document.getElementById('userName').textContent = currentUser.name.split(' ')[0];
            document.getElementById('totalRaised').textContent = '$' + currentUser.total_donations.toLocaleString();
            document.getElementById('referralCode').textContent = currentUser.referral_code;
            document.getElementById('rank').textContent = '#' + currentUser.rank;
            document.getElementById('donorsCount').textContent = currentUser.donors;

            // Update achievements
            updateAchievements();
            
            // Update leaderboard
            updateLeaderboard();
        }

        function updateAchievements() {
            const achievements = [
                { title: "First Steps", desc: "Create account and set up profile", threshold: 0 },
                { title: "Breaking Ground", desc: "Raise your first $100", threshold: 100 },
                { title: "Momentum Builder", desc: "Reach $1,000 in donations", threshold: 1000 },
                { title: "Rising Star", desc: "Hit $2,500 milestone", threshold: 2500 },
                { title: "Impact Leader", desc: "Surpass $5,000 raised", threshold: 5000 },
                { title: "Champion Status", desc: "Reach $10,000 in total donations", threshold: 10000 }
            ];

            const achievementsList = document.getElementById('achievementsList');
            achievementsList.innerHTML = '';

            achievements.forEach(achievement => {
                const isCompleted = currentUser.total_donations >= achievement.threshold;
                const progress = achievement.threshold > 0 ? 
                    Math.min(100, Math.round((currentUser.total_donations / achievement.threshold) * 100)) : 100;

                const item = document.createElement('div');
                item.className = 'progress-item';
                item.innerHTML = `
                    <div class="progress-info">
                        <div class="progress-icon ${isCompleted ? 'completed' : 'pending'}">
                            ${isCompleted ? '✓' : '⏳'}
                        </div>
                        <div class="progress-text">
                            <h4>${achievement.title}</h4>
                            <p>${achievement.desc}</p>
                        </div>
                    </div>
                    <div class="progress-value">${isCompleted ? 'Complete' : progress + '%'}</div>
                `;
                achievementsList.appendChild(item);
            });
        }

        function updateLeaderboard() {
            const leaderboardList = document.getElementById('leaderboardList');
            leaderboardList.innerHTML = '';

            allUsers.forEach((user, index) => {
                const isCurrentUser = user.email === currentUser.email;
                const item = document.createElement('div');
                item.className = `leaderboard-item ${isCurrentUser ? 'current-user' : ''}`;
                
                const rankClass = index === 0 ? 'rank-1' : 
                                 index === 1 ? 'rank-2' : 
                                 index === 2 ? 'rank-3' : 'rank-other';
                
                const initial = user.name.charAt(0).toUpperCase();
                
                item.innerHTML = `
                    <div class="leaderboard-rank ${rankClass}">${user.rank}</div>
                    <div class="leaderboard-avatar">${initial}</div>
                    <div class="leaderboard-info">
                        <div class="leaderboard-name">${user.name}${isCurrentUser ? ' (You)' : ''}</div>
                        <div class="leaderboard-amount">$${user.total_donations.toLocaleString()} raised</div>
                    </div>
                `;
                leaderboardList.appendChild(item);
            });
        }

        function logout() {
            currentUser = null;
            document.getElementById('authContainer').style.display = 'flex';
            document.getElementById('dashboard').classList.remove('active');
            document.getElementById('logoutSection').style.display = 'none';
            
            // Clear form fields
            document.getElementById('loginEmail').value = '';
            document.getElementById('loginPassword').value = '';
            document.getElementById('signupName').value = '';
            document.getElementById('signupEmail').value = '';
            document.getElementById('signupPassword').value = '';
            
            switchToLogin();
        }

        // Initialize the app when the page loads
        initializeApp();
  
