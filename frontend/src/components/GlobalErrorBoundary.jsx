import React from 'react';
import { AlertTriangle } from 'lucide-react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                    <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden border border-red-100">
                        <div className="bg-red-50 p-4 flex items-center border-b border-red-100">
                            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                            <h1 className="text-lg font-semibold text-red-900">Application Error</h1>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-700 mb-4">
                                Something went wrong while rendering the application. Please try refreshing the page.
                            </p>
                            {this.state.error && (
                                <div className="bg-gray-900 rounded-md p-4 overflow-auto max-h-96">
                                    <p className="text-red-400 font-mono text-sm font-bold mb-2">
                                        {this.state.error.toString()}
                                    </p>
                                    <pre className="text-gray-400 font-mono text-xs whitespace-pre-wrap">
                                        {this.state.errorInfo?.componentStack}
                                    </pre>
                                </div>
                            )}
                        </div>
                        <div className="bg-gray-50 p-4 flex justify-end">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                            >
                                Refresh Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;
