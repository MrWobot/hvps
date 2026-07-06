#ifndef TIME_HELPER_HPP
#define TIME_HELPER_HPP
#include <cstdint> 
class TimeHelper {
public:
    // Returns the current time in milliseconds since boot
    static int64_t s();
    static int64_t us();
    static int64_t ms();
};

#endif // TIME_HELPER_HPP
