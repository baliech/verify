import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Tag, Send, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card,CardContent, CardHeader, CardTitle,CardDescription } from "@/components/ui/card";
import { DottedSeparator } from '@/components/ui/dotted-separator';

// Sample data for suggestions
const SAMPLE_OPTIONS: string[] = [
    'Date', 
    'Total', 
    'Name', 
    'reference-number', 
    'patient name', 
    'Date', 
    
  ];
  
  export const CapsuleInput: React.FC = () => {
    const [input, setInput] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const inputRef = useRef<HTMLDivElement>(null);
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInput(value);
  
      // Filter suggestions based on input
      if (value) {
        const filteredSuggestions = SAMPLE_OPTIONS
          .filter(
            (option): boolean => 
              option.toLowerCase().includes(value.toLowerCase()) && 
              !selectedTags.includes(option)
          );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    };
  
    const addTag = (tag: string) => {
      if (!selectedTags.includes(tag)) {
        setSelectedTags((prevTags) => [...prevTags, tag]);
        setInput('');
        setSuggestions([]);
        inputRef.current?.focus();
      }
    };
  
    const removeTag = (tagToRemove: string) => {
      setSelectedTags((prevTags) => 
        prevTags.filter(tag => tag !== tagToRemove)
      );
      setIsSubmitted(false);
    };
  
    const handleSubmit = () => {
      if (selectedTags.length > 0) {
        // Simulate submission
        console.log('Submitted Tags:', selectedTags);
        setIsSubmitted(true);
        
        // Optional: Reset after 2 seconds
        setTimeout(() => {
          setIsSubmitted(false);
        }, 2000);
      }
    };
  
    // Close suggestions when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          inputRef.current && 
          !inputRef.current.contains(event.target as Node)
        ) {
          setIsFocused(false);
          setSuggestions([]);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
    return (
        <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex p-7">
            <CardTitle className="text-xl font-bold">
                Keywords Settings.
            </CardTitle>
            <CardDescription>
                Select Keywords for analysis
            </CardDescription>
        </CardHeader>
        <div className="px-7">
            <DottedSeparator/>

        </div>
        <CardContent className="p-7">
      <div className="w-full max-w-xl mx-auto p-6">
        <div 
          ref={inputRef}
          className={`
            relative w-full bg-white 
            border-2 rounded-xl shadow-lg transition-all duration-300
            ${isFocused 
              ? 'border-indigo-500 ring-4 ring-indigo-100' 
              : 'border-gray-300 hover:border-gray-400'
            }
          `}
        >
        {/* Container for Tags and Input */}
        <div className="flex flex-wrap items-center gap-2 p-3 pr-20">
          {/* Selected Tags/Capsules */}
          <AnimatePresence>
            {selectedTags.map((tag, index) => (
              <motion.div
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex items-center bg-indigo-100 text-indigo-800 rounded-full 
                           px-3 py-1 text-sm font-medium space-x-2 
                           hover:bg-indigo-200 transition-colors"
              >
                <Tag size={16} className="mr-1 text-indigo-600" />
                {tag}
                <button 
                  onClick={() => removeTag(tag)} 
                  className="ml-2 text-indigo-500 hover:text-indigo-700 
                             hover:bg-indigo-300 rounded-full p-0.5"
                >
                  <X size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Input Field */}
          <div className="flex-grow relative">
            <div className="flex items-center">
              <Search 
                size={20} 
                className="mr-2 text-gray-400" 
              />
              <input 
                type="text"
                value={input}
                onChange={handleInputChange}
                onFocus={() => setIsFocused(true)}
                placeholder="Add tags..."
                className="w-full outline-none text-gray-700 placeholder-gray-400 bg-transparent"
              />
            </div>

            {/* Suggestions Dropdown */}
            <AnimatePresence>
              {isFocused && suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute z-20 w-full bg-white 
                             border rounded-lg shadow-xl mt-2 
                             overflow-hidden"
                >
                  {suggestions.map(suggestion => (
                    <motion.div 
                      key={suggestion}
                      whileHover={{ backgroundColor: '#f3f4f6' }}
                      onClick={() => addTag(suggestion)}
                      className="px-4 py-2 cursor-pointer 
                                 text-gray-700 hover:bg-gray-100
                                 flex items-center space-x-2"
                    >
                      <Tag size={16} className="text-gray-400" />
                      <span>{suggestion}</span>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Submit Button */}
          <motion.button
            onClick={handleSubmit}
            disabled={selectedTags.length === 0}
            whileHover={{ scale: selectedTags.length > 0 ? 1.05 : 1 }}
            whileTap={{ scale: selectedTags.length > 0 ? 0.95 : 1 }}
            className={`
              absolute right-3 top-1/2 -translate-y-1/2 
              flex items-center justify-center 
              w-12 h-12 rounded-full 
              transition-all duration-300
              ${selectedTags.length > 0 
                ? (isSubmitted 
                    ? 'bg-green-500 text-white' 
                    : 'bg-indigo-500 text-white hover:bg-indigo-600') 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
            `}
          >
            {isSubmitted ? (
              <Check size={24} />
            ) : (
              <Send size={20} />
            )}
          </motion.button>
        </div>
      </div>

      {/* Optional: Tag Count */}
      {selectedTags.length > 0 && (
        <div className="text-sm text-gray-500 mt-2 text-right">
          {selectedTags.length} tag{selectedTags.length !== 1 ? 's' : ''} selected
        </div>
      )}
    </div>
    </CardContent>
    <DottedSeparator/>
    </Card>

  );
};

