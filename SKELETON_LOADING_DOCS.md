# Skeleton Loading UI System

## Overview
A comprehensive skeleton loading UI system for the AI Assistance page that replaces the simple spinning circle with a modern, layout-aware skeleton loader. Includes theme support, smooth animations, and reusable components.

## Files Created

### 1. **Skeleton.jsx** - Base Components
Core skeleton components used as building blocks:

- `Skeleton`: Basic animated skeleton bar with pulse effect
- `SkeletonShimmer`: Skeleton with gradient shimmer animation
- `SkeletonCircle`: Circular skeleton for avatars/icons
- `SkeletonBar`: Rectangular skeleton with customizable dimensions

**Features:**
- Light/dark theme support via Tailwind CSS
- Smooth pulse animation
- Optional shimmer effect with gradient
- Customizable width, height, and border radius

### 2. **SkeletonComponents.jsx** - Specialized Components
High-level components that mimic specific page sections:

- `SkeletonHeader`: Header section with icon, title, and buttons
- `SkeletonMessage`: Individual chat message skeleton (user/AI alternating)
- `SkeletonChatMessages`: Multiple message skeletons
- `SkeletonInput`: Chat input box skeleton
- `SkeletonChatBox`: Complete chat interface skeleton
- `SkeletonSidebar`: Sidebar/history panel skeleton

### 3. **AIAssistanceSkeletonLoader.jsx** - Main Loader
Complete page-level skeleton loader that combines all components:
- Mirrors the actual AI Assistance page layout
- Includes full background styling (light and dark modes)
- Responsive grid layout
- All animations coordinated

### 4. **index.js** - Barrel Export
Centralized export file for all skeleton components.

## Theme Support

The skeleton system automatically adapts to light/dark themes:

### Light Theme
- Background: `from-gray-200 via-gray-100 to-gray-200`
- Uses lighter grays for subtle contrast

### Dark Theme
- Background: `from-gray-700 via-gray-600 to-gray-700`
- Uses darker grays suitable for dark mode

**How it works:**
- Detects theme via `document.documentElement.classList.contains('dark')`
- All components use Tailwind's `dark:` prefix for conditional styling
- Pass `isDark` prop to `AIAssistanceSkeletonLoader` for manual control

## Animation Effects

### 1. Pulse Animation (Default)
```css
animate-pulse - Smooth fading effect
```

### 2. Shimmer Animation (Optional)
```css
@keyframes shimmer {
  0% { background-position: -1000px 0; }
  100% { background-position: 1000px 0; }
}
```
- Creates a glossy left-to-right sweep effect
- Applied as overlay on the skeleton
- Duration: 2 seconds, infinite loop

## Usage Examples

### Basic Skeleton Bar
```jsx
import { Skeleton } from '@/components/Skeleton';

<Skeleton width="w-64" height="h-4" />
```

### With Shimmer Effect
```jsx
import { SkeletonShimmer } from '@/components/Skeleton';

<SkeletonShimmer width="w-48" height="h-5" />
```

### Circular Skeleton (Avatar)
```jsx
import { SkeletonCircle } from '@/components/Skeleton';

<SkeletonCircle size="w-12 h-12" />
```

### Full AI Assistance Page Loader
```jsx
import { AIAssistanceSkeletonLoader } from '@/components/Skeleton';

export default function AIAssistance() {
  const [isDark, setIsDark] = useState(false);
  const { loading } = useSelector((state) => state.profile);

  if (loading) {
    return <AIAssistanceSkeletonLoader isDark={isDark} />;
  }

  return <ActualPageContent />;
}
```

### Individual Component Usage
```jsx
import { SkeletonHeader, SkeletonChatBox, SkeletonSidebar } from '@/components/Skeleton';

<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-3">
    <SkeletonChatBox />
  </div>
  <div className="hidden lg:block">
    <SkeletonSidebar />
  </div>
</div>
```

## Customization

### Adjust Animation Speed
Modify the shimmer animation duration in any component:
```jsx
style={{
  animation: 'shimmer 3s infinite', // Change 2s to desired duration
}}
```

### Customize Colors
Update the gradient colors in Skeleton.jsx:
```jsx
// Light mode
className={`
  bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200
  ...
`}

// Dark mode
dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
```

### Adjust Message Count
Change the count in SkeletonChatMessages:
```jsx
<SkeletonChatMessages count={5} /> // Default is 3
```

## Performance Optimization

- **No unnecessary re-renders**: Components use static content
- **CSS-based animations**: Hardware-accelerated via GPU
- **Minimal DOM**: Only displays when loading state is active
- **Responsive design**: Works seamlessly on all screen sizes

## Browser Support

- Modern browsers with CSS Grid and Tailwind CSS support
- CSS animations: All modern browsers
- Shimmer effect: Requires modern CSS features (gradient, animations)

## Accessibility Considerations

The skeleton loaders are:
- Not interactive (no tab stops)
- Low-priority for screen readers
- Temporary UI (replaced quickly by actual content)
- Color-not-dependent (use opacity/contrast)

## Integration Points

### Updated Files
1. **src/app/ai-assistance/page.js**
   - Replaced spinner with `AIAssistanceSkeletonLoader`
   - Added import for skeleton components
   - Passes `isDark` prop for theme support

### How to Integrate in Other Pages

1. Import the skeleton loader:
```jsx
import { AIAssistanceSkeletonLoader } from '@/components/Skeleton';
// Or individual components
import { SkeletonHeader, SkeletonChatBox } from '@/components/Skeleton';
```

2. Track dark mode:
```jsx
const [isDark, setIsDark] = useState(false);

useEffect(() => {
  const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
  checkDark();
  const observer = new MutationObserver(checkDark);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}, []);
```

3. Show skeleton during loading:
```jsx
if (loading) {
  return <AIAssistanceSkeletonLoader isDark={isDark} />;
}
```

## Layout Shift Prevention

All skeleton components maintain the same dimensions as their corresponding content:
- No sudden size changes when content loads
- Prevents Cumulative Layout Shift (CLS)
- Improves perceived performance
- Better user experience

## Advanced: Creating Custom Skeleton Layouts

Template for new skeleton components:

```jsx
export function SkeletonCustomLayout() {
  return (
    <div className="animate-pulse">
      {/* Structure mirrors actual component */}
      <div className="flex gap-4 mb-4">
        <SkeletonCircle size="w-12 h-12" />
        <div className="flex-1 space-y-2">
          <SkeletonBar width="w-48" height="h-4" />
          <SkeletonBar width="w-32" height="h-3" />
        </div>
      </div>
      {/* Repeat for other sections */}
    </div>
  );
}
```

## Testing Recommendations

1. **Theme Switching**: Toggle dark mode and verify skeleton adapts
2. **Loading States**: Artificially delay profile loading to test skeleton display
3. **Responsive**: Test on mobile, tablet, and desktop
4. **Animation**: Verify smooth pulse/shimmer without jank
5. **Accessibility**: Test with screen readers

## Future Enhancements

Potential improvements:
- [ ] Add skeleton loaders for other pages (Notes, Assignment Guide, etc.)
- [ ] Custom shimmer gradient colors per theme
- [ ] Configurable animation durations
- [ ] Skeleton presets for common layouts
- [ ] Performance monitoring/metrics
