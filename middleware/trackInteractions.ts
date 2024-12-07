// middleware/trackInteractions.ts
import { Request, Response, NextFunction } from 'express';
import { combinedModels } from '../models/combinedModels'; // Update import to combined models
import geoip from 'geoip-lite';

export function trackApiInteraction(req: Request, res: Response, next: NextFunction) {
  try {
    const interaction = new combinedModels.UserInteraction({
      userId: req.user ? req.user.id : 'anonymous',
      actionType: 'api_call',
      details: {
        endpoint: req.path,
        method: req.method,
        params: req.params,
        query: req.query
      },
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent') || 'unknown',
        location: getLocationFromIP(req.ip || ''),
        deviceType: getDeviceType(req.get('User-Agent') || 'unknown')
      }
    });

    interaction.save();
    next();
  } catch (error) {
    console.error('Interaction tracking error:', error);
    next();
  }
}

export function trackSearchQuery(req: Request, res: Response, next: NextFunction) {
  try {
    const searchQuery = req.query.q || req.body.query;
    
    if (searchQuery) {
      const interaction = new combinedModels.UserInteraction({
        userId: req.user ? req.user.id : 'anonymous',
        actionType: 'search',
        query: searchQuery,
        details: {
          originalQuery: searchQuery,
          processedQuery: processSearchQuery(searchQuery)
        },
        metadata: {
          ipAddress: req.ip,
          userAgent: req.get('User-Agent') || 'unknown'
        }
      });

      interaction.save();
    }
    next();
  } catch (error) {
    console.error('Search tracking error:', error);
    next();
  }
}

function getLocationFromIP(ip: string) {
  try {
    const geo = geoip.lookup(ip);
    return {
      country: geo?.country || 'Unknown',
      city: geo?.city || 'Unknown'
    };
  } catch {
    return { country: 'Unknown', city: 'Unknown' };
  }
}

function getDeviceType(userAgent: string) {
  if (/mobile/i.test(userAgent)) return 'mobile';
  if (/tablet/i.test(userAgent)) return 'tablet';
  return 'desktop';
}

function processSearchQuery(query: string) {
  return query
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/gi, '');
}