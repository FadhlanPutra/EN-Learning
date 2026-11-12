import { Link } from 'react-router-dom';
import { useProgress } from '../context/ProgressContext';
import { useAuth } from '../context/AuthContext';
import { PointsBadge } from '../components/PointsBadge';
import { FaPlay, FaUsers, FaTrophy, FaArrowRight } from 'react-icons/fa';

export function Home() {
  const { totalPoints, isLoading } = useProgress();
  const { isAuthenticated } = useAuth();

  const steps = [
    { number: 1, title: 'Form Groups', description: 'Divide students into several groups. Each group will work together to answer questions.' },
    { number: 2, title: 'Choose Level', description: 'Start with Easy (Level 1), then progress to Medium (Level 2), and finally Challenge (Level 3).' },
    { number: 3, title: 'Take Turns', description: 'Groups take turns answering questions. Each group gets a chance to earn points.' },
    { number: 4, title: 'Earn Points', description: 'Correct answers earn points equal to the item price. Harder questions are worth more points.' },
    { number: 5, title: 'Bonus Challenge', description: 'For Challenge level questions, earn bonus points by explaining the word meaning or creating your own sentence.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-600 via-orange-700 to-amber-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/favicon.svg')] opacity-5" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <span className="text-2xl">🏪</span>
              <span className="font-medium">Quiz Shop</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Learn English Through{' '}
              <span className="relative">
                <span className="relative z-10">Fun Quizzes</span>
                <span className="absolute bottom-0 left-0 right-0 h-2 bg-yellow-300/50 -z-10" aria-hidden="true" />
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl">
              A classroom game where groups buy questions like items in a shop. Answer correctly to earn points!
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-700"
              >
                <FaPlay className="w-5 h-5" />
                Start Shopping
              </Link>
              <Link
                to="/leaderboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-700 backdrop-blur-sm"
              >
                <FaTrophy className="w-5 h-5" />
                View Leaderboard
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-orange-600 to-transparent" aria-hidden="true" />
      </section>

      {/* Stats Bar */}
      <section className="-mt-16 mb-16 px-4 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <FaUsers className="w-10 h-10 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Group Learning</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Designed for classroom group activities</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <FaTrophy className="w-10 h-10 text-amber-600 dark:text-amber-400 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Progressive Levels</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Easy → Medium → Challenge</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
            <PointsBadge points={isLoading ? 0 : totalPoints} size="lg" showLabel={false} />
            <p className="text-gray-600 dark:text-gray-400 mt-1">Total Points Earned</p>
          </div>
        </div>
      </section>

      {/* How to Play */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">How to Play</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Follow these steps to run a successful Quiz Shop session in your classroom
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 flex items-center justify-center">
                  <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">{step.number}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Question Types</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Four different question types keep the game engaging and challenging
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon="📝"
              title="Multiple Choice"
              level="Level 1 (Easy)"
              description="Choose from 4 options. Perfect for vocabulary and basic grammar."
              color="green"
            />
            <FeatureCard
              icon="✏️"
              title="Short Answer"
              level="Level 2 (Medium)"
              description="Type your answer. Tests grammar, vocabulary, and translation skills."
              color="blue"
            />
            <FeatureCard
              icon="🔤"
              title="Word Arrange"
              level="Level 3 (Challenge)"
              description="Tap scrambled word tiles to form correct sentences. Keyboard accessible."
              color="purple"
            />
            <FeatureCard
              icon="🔍"
              title="Guess the Word"
              level="Level 3 (Challenge)"
              description="Solve riddles with emoji clues. Fun vocabulary challenge!"
              color="orange"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-orange-600 to-amber-700 rounded-2xl p-12 text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-lg text-white/90 mb-8">
            Gather your groups, login, and begin your English learning adventure!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to={isAuthenticated ? '/shop' : '/login'}
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-orange-600 font-semibold rounded-lg hover:bg-white/90 transition-colors"
            >
              <FaArrowRight className="w-5 h-5" />
              {isAuthenticated ? 'Go to Shop' : 'Login to Play'}
            </Link>
            <Link
              to="/leaderboard"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors backdrop-blur-sm"
            >
              <FaTrophy className="w-5 h-5" />
              View Rankings
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, level, description, color }: { icon: string; title: string; level: string; description: string; color: string }) {
  const colorClasses = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 border-orange-200 dark:border-orange-800',
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 border ${colorClasses[color as keyof typeof colorClasses]} hover:shadow-lg transition-shadow`}>
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm font-medium mb-3">{level}</p>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}